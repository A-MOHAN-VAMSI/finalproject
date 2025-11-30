const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.notification.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create teacher
    console.log('👨‍🏫 Creating teacher account...');
    const teacher = await prisma.user.create({
        data: {
            email: 'teacher@example.com',
            password: hashedPassword,
            name: 'Prof. Sarah Johnson',
            role: 'TEACHER'
        }
    });

    // Create students
    console.log('👨‍🎓 Creating student accounts...');
    const students = await Promise.all([
        prisma.user.create({
            data: {
                email: 'student1@example.com',
                password: hashedPassword,
                name: 'Alex Chen',
                role: 'STUDENT'
            }
        }),
        prisma.user.create({
            data: {
                email: 'student2@example.com',
                password: hashedPassword,
                name: 'Emma Rodriguez',
                role: 'STUDENT'
            }
        }),
        prisma.user.create({
            data: {
                email: 'student3@example.com',
                password: hashedPassword,
                name: 'Michael Kumar',
                role: 'STUDENT'
            }
        }),
        prisma.user.create({
            data: {
                email: 'student4@example.com',
                password: hashedPassword,
                name: 'Sophia Williams',
                role: 'STUDENT'
            }
        }),
        prisma.user.create({
            data: {
                email: 'student5@example.com',
                password: hashedPassword,
                name: 'James Anderson',
                role: 'STUDENT'
            }
        })
    ]);

    // Create projects
    console.log('📚 Creating projects...');
    const projects = await Promise.all([
        prisma.project.create({
            data: {
                title: 'AI-Powered Study Assistant',
                description: 'Design and develop an AI-powered study assistant that helps students organize their learning materials, create study schedules, and provides personalized quiz questions based on their course content.',
                tags: 'AI,Machine Learning,Education,Web App',
                dueDate: new Date('2025-12-15'),
                teacherId: teacher.id
            }
        }),
        prisma.project.create({
            data: {
                title: 'Sustainable Campus Initiative',
                description: 'Create a comprehensive proposal and prototype for making the campus more sustainable. Include data analysis of current energy usage, waste management strategies, and student engagement plans.',
                tags: 'Sustainability,Environment,Data Analysis,IoT',
                dueDate: new Date('2025-12-20'),
                teacherId: teacher.id
            }
        }),
        prisma.project.create({
            data: {
                title: 'Mobile Health Tracker',
                description: 'Develop a mobile application that tracks physical activity, nutrition, sleep patterns, and provides personalized health recommendations. Focus on user experience and data visualization.',
                tags: 'Mobile Dev,Health,UI/UX,React Native',
                dueDate: new Date('2025-12-25'),
                teacherId: teacher.id
            }
        })
    ]);

    // Create submissions
    console.log('📝 Creating submissions...');
    const submissions = [];

    // Project 1 submissions
    submissions.push(await prisma.submission.create({
        data: {
            content: 'Our AI Study Assistant uses GPT-4 API to generate personalized quiz questions and uses spaced repetition algorithms to optimize learning retention. We built it with React and Node.js.\n\nDemo: https://ai-study-demo.vercel.app\nGitHub: https://github.com/demo/ai-study',
            imageUrl: '',
            fileUrl: '',
            studentId: students[0].id,
            projectId: projects[0].id
        }
    }));

    submissions.push(await prisma.submission.create({
        data: {
            content: 'Developed a comprehensive study assistant with calendar integration, flashcard generation, and AI-powered summarization. Used Python for backend ML models and React for frontend.\n\nFeatures:\n- Auto-generated flashcards from PDFs\n- Smart scheduling with calendar sync\n- Progress tracking dashboard',
            imageUrl: '',
            fileUrl: '',
            studentId: students[1].id,
            projectId: projects[0].id
        }
    }));

    // Project 2 submissions
    submissions.push(await prisma.submission.create({
        data: {
            content: 'Our campus sustainability initiative includes IoT sensors for real-time energy monitoring, a student engagement app, and a comprehensive waste reduction plan. We analyzed 6 months of campus data and identified 30% potential energy savings.\n\nKey Findings:\n- 40% waste reduction possible through better recycling\n- Solar panel installation ROI: 5 years\n- Student carpooling app could reduce emissions by 25%',
            imageUrl: '',
            fileUrl: '',
            studentId: students[2].id,
            projectId: projects[1].id
        }
    }));

    submissions.push(await prisma.submission.create({
        data: {
            content: 'Created a detailed sustainability roadmap with focus on renewable energy, water conservation, and community engagement. Includes budget analysis and 5-year implementation plan.\n\nDeliverables:\n- Full proposal document (attached PDF)\n- Interactive dashboard prototype\n- Community survey results (n=500)',
            imageUrl: '',
            fileUrl: '',
            studentId: students[3].id,
            projectId: projects[1].id
        }
    }));

    // Project 3 submissions
    submissions.push(await prisma.submission.create({
        data: {
            content: 'Built a cross-platform mobile health tracker using React Native. Features include step counting using device sensors, nutrition logging with barcode scanning, sleep analysis, and personalized health insights.\n\nTech Stack:\n- React Native (iOS & Android)\n- Firebase for backend\n- HealthKit & Google Fit APIs\n- Chart.js for data visualization\n\nTestFlight Beta: Available on request',
            imageUrl: '',
            fileUrl: '',
            studentId: students[4].id,
            projectId: projects[2].id
        }
    }));

    submissions.push(await prisma.submission.create({
        data: {
            content: 'Developed a minimalist health tracker focusing on habit formation and gamification. Users earn achievements for consistent tracking and can compete with friends.\n\nUnique Features:\n- 7-day habit streaks\n- Social challenges\n- Integration with Fitbit & Apple Watch\n- Mental health mood tracking',
            imageUrl: '',
            fileUrl: '',
            studentId: students[0].id,
            projectId: projects[2].id
        }
    }));

    // Create reviews
    console.log('⭐ Creating peer reviews...');
    
    // Reviews for submission 1
    await prisma.review.create({
        data: {
            content: 'Excellent implementation of the AI features! The spaced repetition algorithm is well-designed. I would suggest adding more customization options for the quiz difficulty levels.',
            score: 5,
            reviewerId: students[1].id,
            submissionId: submissions[0].id
        }
    });

    await prisma.review.create({
        data: {
            content: 'Great project! The UI is clean and intuitive. The GPT-4 integration works smoothly. Consider adding offline mode for studying without internet.',
            score: 4,
            reviewerId: students[2].id,
            submissionId: submissions[0].id
        }
    });

    // Reviews for submission 2
    await prisma.review.create({
        data: {
            content: 'Very impressive flashcard auto-generation feature! The calendar integration is seamless. The progress dashboard could benefit from more detailed analytics.',
            score: 5,
            reviewerId: students[0].id,
            submissionId: submissions[1].id
        }
    });

    await prisma.review.create({
        data: {
            content: 'Solid implementation. The Python ML models are well-documented. I recommend adding collaborative study group features.',
            score: 4,
            reviewerId: teacher.id,
            submissionId: submissions[1].id
        }
    });

    // Reviews for submission 3
    await prisma.review.create({
        data: {
            content: 'Outstanding research and data analysis! The IoT sensor implementation is innovative. The waste reduction strategies are practical and achievable.',
            score: 5,
            reviewerId: students[3].id,
            submissionId: submissions[2].id
        }
    });

    // Reviews for submission 4
    await prisma.review.create({
        data: {
            content: 'Comprehensive proposal with solid budget analysis. The 5-year roadmap is realistic. Great work on the community survey - impressive sample size.',
            score: 5,
            reviewerId: students[2].id,
            submissionId: submissions[3].id
        }
    });

    // Reviews for submission 5
    await prisma.review.create({
        data: {
            content: 'Excellent cross-platform implementation! The UI/UX is polished and the health insights are valuable. API integrations work flawlessly.',
            score: 5,
            reviewerId: students[0].id,
            submissionId: submissions[4].id
        }
    });

    await prisma.review.create({
        data: {
            content: 'Very well executed! The data visualization is clean and informative. Consider adding more granular nutrition tracking options.',
            score: 4,
            reviewerId: teacher.id,
            submissionId: submissions[4].id
        }
    });

    // Create comments for collaboration
    console.log('💬 Creating collaboration comments...');
    await prisma.comment.create({
        data: {
            content: 'Hey! I love your approach to the AI quiz generation. Did you consider using few-shot prompting for better question quality?',
            authorId: students[1].id,
            submissionId: submissions[0].id
        }
    });

    await prisma.comment.create({
        data: {
            content: 'Thanks! Yes, we experimented with few-shot prompting. It improved question relevance by about 40%. Happy to share our prompt templates!',
            authorId: students[0].id,
            submissionId: submissions[0].id
        }
    });

    await prisma.comment.create({
        data: {
            content: 'The sustainability data analysis is impressive! What tools did you use for data collection from the IoT sensors?',
            authorId: students[3].id,
            submissionId: submissions[2].id
        }
    });

    // Create assignments
    console.log('📋 Creating peer review assignments...');
    await prisma.assignment.create({
        data: {
            projectId: projects[0].id,
            reviewerId: students[1].id,
            submissionId: submissions[0].id,
            status: 'COMPLETED',
            dueDate: new Date('2025-12-10')
        }
    });

    await prisma.assignment.create({
        data: {
            projectId: projects[0].id,
            reviewerId: students[2].id,
            submissionId: submissions[0].id,
            status: 'COMPLETED',
            dueDate: new Date('2025-12-10')
        }
    });

    await prisma.assignment.create({
        data: {
            projectId: projects[1].id,
            reviewerId: students[3].id,
            submissionId: submissions[2].id,
            status: 'COMPLETED',
            dueDate: new Date('2025-12-12')
        }
    });

    await prisma.assignment.create({
        data: {
            projectId: projects[2].id,
            reviewerId: students[1].id,
            submissionId: submissions[4].id,
            status: 'PENDING',
            dueDate: new Date('2025-12-18')
        }
    });

    // Create notifications
    console.log('🔔 Creating notifications...');
    await prisma.notification.create({
        data: {
            userId: students[1].id,
            message: 'You have been assigned to review "AI-Powered Study Assistant" by Alex Chen',
            type: 'INFO'
        }
    });

    await prisma.notification.create({
        data: {
            userId: students[0].id,
            message: 'Emma Rodriguez reviewed your submission!',
            type: 'SUCCESS'
        }
    });

    await prisma.notification.create({
        data: {
            userId: students[4].id,
            message: 'Your submission for "Mobile Health Tracker" received a 5-star review!',
            type: 'SUCCESS'
        }
    });

    await prisma.notification.create({
        data: {
            userId: students[1].id,
            message: 'Reminder: Peer review assignment due in 3 days',
            type: 'WARNING'
        }
    });

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('\nTeacher:');
    console.log('  Email: teacher@example.com');
    console.log('  Password: password123\n');
    console.log('Students:');
    console.log('  student1@example.com - password123 (Alex Chen)');
    console.log('  student2@example.com - password123 (Emma Rodriguez)');
    console.log('  student3@example.com - password123 (Michael Kumar)');
    console.log('  student4@example.com - password123 (Sophia Williams)');
    console.log('  student5@example.com - password123 (James Anderson)\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
