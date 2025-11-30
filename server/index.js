const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001; // Changed to 3001 for debugging
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf|zip/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (JPEG, PNG) and documents (PDF, ZIP) are allowed!'));
        }
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to check if user is a teacher
const requireTeacher = (req, res, next) => {
    if (req.user.role !== 'TEACHER') {
        return res.status(403).json({ error: 'Teacher access required' });
    }
    next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'STUDENT'
            }
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Project Routes
app.get('/api/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                teacher: { select: { name: true } },
                _count: { select: { submissions: true } },
                submissions: {
                    where: { studentId: req.user.id },
                    select: { id: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform to add isSubmitted flag
        const projectsWithStatus = projects.map(p => ({
            ...p,
            isSubmitted: p.submissions.length > 0
        }));

        res.json(projectsWithStatus);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.post('/api/projects', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { title, description, dueDate, tags } = req.body;
        const project = await prisma.project.create({
            data: {
                title,
                description,
                tags: tags || '',
                dueDate: new Date(dueDate),
                teacherId: req.user.id
            }
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

app.get('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                teacher: { select: { name: true } },
                submissions: {
                    include: {
                        student: { select: { id: true, name: true } },
                        reviews: {
                            include: {
                                reviewer: { select: { name: true, role: true } }
                            }
                        },
                        _count: { select: { comments: true } }
                    }
                }
            }
        });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Submission Routes with file upload
app.post('/api/submissions', authenticateToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), async (req, res) => {
    try {
        const { projectId, content } = req.body;

        const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : '';
        const fileUrl = req.files?.file ? `/uploads/${req.files.file[0].filename}` : '';

        const submission = await prisma.submission.create({
            data: {
                content,
                imageUrl,
                fileUrl,
                projectId: parseInt(projectId),
                studentId: req.user.id
            },
            include: {
                student: { select: { name: true } },
                project: { select: { title: true } }
            }
        });
        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create submission' });
    }
});

app.get('/api/submissions/my', authenticateToken, async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            where: { studentId: req.user.id },
            include: {
                project: true,
                reviews: {
                    include: {
                        reviewer: { select: { name: true, role: true } }
                    }
                },
                _count: { select: { comments: true } }
            }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Get all submissions (for teachers to view and grade)
app.get('/api/submissions/all', authenticateToken, async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            include: {
                student: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, title: true, tags: true } },
                reviews: {
                    include: {
                        reviewer: { select: { name: true, role: true } }
                    }
                },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all submissions' });
    }
});

// Grade a submission
app.put('/api/submissions/:id/grade', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { points } = req.body;
        const submission = await prisma.submission.update({
            where: { id: parseInt(req.params.id) },
            data: { points: parseInt(points) }
        });
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: 'Failed to grade submission' });
    }
});

// Review Routes
app.post('/api/reviews', authenticateToken, async (req, res) => {
    try {
        const { submissionId, content, score } = req.body;
        const scoreInt = parseInt(score);

        // Validate score is between 1-5 stars
        if (scoreInt < 1 || scoreInt > 5) {
            return res.status(400).json({ error: 'Score must be between 1 and 5 stars' });
        }

        const review = await prisma.review.create({
            data: {
                content,
                score: scoreInt,
                submissionId: parseInt(submissionId),
                reviewerId: req.user.id
            },
            include: {
                reviewer: { select: { name: true, role: true } }
            }
        });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create review' });
    }
});

app.get('/api/reviews/my', authenticateToken, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { reviewerId: req.user.id },
            include: {
                submission: {
                    include: {
                        project: true,
                        student: { select: { name: true } }
                    }
                }
            }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Comment/Collaboration Routes
app.post('/api/comments', authenticateToken, async (req, res) => {
    try {
        const { submissionId, content } = req.body;
        const comment = await prisma.comment.create({
            data: {
                content,
                submissionId: parseInt(submissionId),
                authorId: req.user.id
            },
            include: {
                author: { select: { name: true, role: true } }
            }
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

app.get('/api/submissions/:id/comments', authenticateToken, async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: { submissionId: parseInt(req.params.id) },
            include: {
                author: { select: { name: true, role: true } }
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Assignment Routes
app.post('/api/assignments', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { projectId, reviewerId, submissionId, dueDate } = req.body;
        const assignment = await prisma.assignment.create({
            data: {
                projectId: parseInt(projectId),
                reviewerId: parseInt(reviewerId),
                submissionId: parseInt(submissionId),
                dueDate: new Date(dueDate)
            },
            include: {
                reviewer: { select: { name: true, email: true } },
                submission: {
                    include: {
                        student: { select: { name: true } },
                        project: { select: { title: true } }
                    }
                }
            }
        });

        // Create notification for the reviewer
        await prisma.notification.create({
            data: {
                userId: parseInt(reviewerId),
                message: `You have been assigned to review "${assignment.submission.project.title}" by ${assignment.submission.student.name}`,
                type: 'INFO'
            }
        });

        res.json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
});

app.get('/api/assignments', authenticateToken, async (req, res) => {
    try {
        const assignments = await prisma.assignment.findMany({
            include: {
                reviewer: { select: { id: true, name: true } },
                submission: {
                    include: {
                        student: { select: { name: true } },
                        project: { select: { title: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});

app.get('/api/assignments/my', authenticateToken, async (req, res) => {
    try {
        const assignments = await prisma.assignment.findMany({
            where: { reviewerId: req.user.id },
            include: {
                submission: {
                    include: {
                        student: { select: { name: true } },
                        project: { select: { title: true } }
                    }
                }
            },
            orderBy: { dueDate: 'asc' }
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your assignments' });
    }
});

app.put('/api/assignments/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const assignment = await prisma.assignment.update({
            where: { id: parseInt(req.params.id) },
            data: { status }
        });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update assignment status' });
    }
});

// Notification Routes
app.get('/api/notifications/my', authenticateToken, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
    try {
        const notification = await prisma.notification.update({
            where: { id: parseInt(req.params.id) },
            data: { isRead: true }
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

app.put('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

// Analytics Routes
app.get('/api/analytics/overview', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const totalProjects = await prisma.project.count();
        const totalSubmissions = await prisma.submission.count();
        const totalReviews = await prisma.review.count();
        const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

        // Get average rating
        const reviews = await prisma.review.findMany({ select: { score: true } });
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(2)
            : 0;

        // Get average points (performance)
        const gradedSubmissions = await prisma.submission.findMany({
            where: { points: { not: null } },
            select: { points: true }
        });
        const avgPoints = gradedSubmissions.length > 0
            ? (gradedSubmissions.reduce((sum, s) => sum + s.points, 0) / gradedSubmissions.length).toFixed(1)
            : 0;

        // Get review completion rate
        const totalAssignments = await prisma.assignment.count();
        const assignments = await prisma.assignment.findMany();
        const completedAssignments = assignments.filter(a => a.status === 'COMPLETED').length;
        const completionRate = assignments.length > 0
            ? ((completedAssignments / assignments.length) * 100).toFixed(1)
            : 0;

        // Get submissions by project
        const submissionsByProject = await prisma.project.findMany({
            include: {
                _count: { select: { submissions: true } }
            }
        });

        // Get recent activity
        const recentReviews = await prisma.review.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: { select: { name: true } },
                submission: {
                    include: {
                        student: { select: { name: true } },
                        project: { select: { title: true } }
                    }
                }
            }
        });

        res.json({
            overview: {
                totalProjects,
                totalSubmissions,
                totalReviews,
                totalStudents,
                totalAssignments,
                avgRating: parseFloat(avgRating),
                avgPoints: parseFloat(avgPoints),
                completionRate: parseFloat(completionRate)
            },
            submissionsByProject: submissionsByProject.map(p => ({
                project: p.title,
                count: p._count.submissions
            })),
            recentActivity: recentReviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.get('/api/analytics/student/:id', authenticateToken, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);

        const student = await prisma.user.findUnique({
            where: { id: studentId },
            select: { id: true, name: true, email: true }
        });

        const submissions = await prisma.submission.findMany({
            where: { studentId },
            include: {
                reviews: { select: { score: true } },
                project: { select: { title: true } }
            }
        });

        const reviewsGiven = await prisma.review.findMany({
            where: { reviewerId: studentId },
            include: {
                submission: {
                    include: {
                        student: { select: { name: true } },
                        project: { select: { title: true } }
                    }
                }
            }
        });

        res.json({
            student,
            submissions: submissions.map(s => ({
                project: s.project.title,
                avgRating: s.reviews.length > 0
                    ? (s.reviews.reduce((sum, r) => sum + r.score, 0) / s.reviews.length).toFixed(1)
                    : 0,
                reviewCount: s.reviews.length
            })),
            reviewsGiven: reviewsGiven.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch student analytics' });
    }
});

app.get('/api/analytics/project/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                submissions: {
                    include: {
                        student: { select: { name: true } },
                        reviews: { select: { score: true } }
                    }
                }
            }
        });

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        project.submissions.forEach(sub => {
            sub.reviews.forEach(review => {
                ratingDistribution[review.score]++;
            });
        });

        res.json({
            project: {
                title: project.title,
                description: project.description
            },
            submissionCount: project.submissions.length,
            ratingDistribution,
            submissions: project.submissions.map(s => ({
                student: s.student.name,
                avgRating: s.reviews.length > 0
                    ? (s.reviews.reduce((sum, r) => sum + r.score, 0) / s.reviews.length).toFixed(1)
                    : 0,
                reviewCount: s.reviews.length
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project analytics' });
    }
});

// Start server with debug logging
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to database');

        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

        server.on('error', (e) => {
            console.error('Server error:', e);
        });

        // Keep process alive
        setInterval(() => {
            // Heartbeat
        }, 10000);

    } catch (e) {
        console.error('Failed to start server:', e);
        process.exit(1);
    }
};

startServer();

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
