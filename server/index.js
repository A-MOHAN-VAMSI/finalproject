const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
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
                _count: { select: { submissions: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
