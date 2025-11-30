# 🎓 Peer Review & Collaboration Platform

A full-stack web application for students and teachers to manage project submissions, conduct peer reviews, and track collaboration analytics. Built for hackathons with a stunning modern UI and comprehensive feature set.

![Platform Screenshot](https://via.placeholder.com/1200x600/0f172a/818cf8?text=Peer+Review+Platform)

## ✨ Features

### For Students
- 📝 **Project Submissions**: Upload projects with descriptions, tags, images, and PDF files
- 👥 **Peer Reviews**: Review classmates' work with 1-5 star ratings and detailed feedback
- 💬 **Collaboration**: Real-time comment threads on submissions
- 🔔 **Notifications**: Stay updated on review assignments and feedback
- 📊 **Dashboard**: View all assigned projects and peer submissions

### For Teachers
- 📚 **Project Management**: Create and manage course projects with due dates
- 👨‍🏫 **Assignment System**: Assign specific students as peer reviewers
- 📈 **Analytics Dashboard**: View completion rates, rating distributions, and activity timelines
- 🔍 **Monitoring**: Track all student submissions and review progress
- 📊 **Reports**: Detailed analytics for students and projects

### Technical Highlights
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 JWT-based authentication with role separation
- 📁 Local file upload support (images & PDFs)
- 💾 SQLite database with Prisma ORM
- ⚡ React + Vite frontend
- 🚀 Express.js backend with RESTful APIs
- 🎭 Beautiful animations and transitions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

#### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd peer-review-platform
\`\`\`

#### 2. Backend Setup
\`\`\`bash
cd server
npm install

# Set up environment variables
echo "DATABASE_URL=file:./dev.db" > .env
echo "JWT_SECRET=your-secret-key-change-in-production" >> .env
echo "PORT=3000" >> .env

# Initialize database and run migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npm run seed
\`\`\`

#### 3. Frontend Setup
\`\`\`bash
cd ../client
npm install
\`\`\`

#### 4. Start the Application

**Terminal 1 - Backend:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd client
npm run dev
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🔑 Demo Accounts

After running the seed script, use these credentials:

### Teacher Account
\`\`\`
Email: teacher@example.com
Password: password123
URL: http://localhost:5173/teacher-login
\`\`\`

### Student Accounts
\`\`\`
Email: student1@example.com (Alex Chen)
Email: student2@example.com (Emma Rodriguez)
Email: student3@example.com (Michael Kumar)
Email: student4@example.com (Sophia Williams)
Email: student5@example.com (James Anderson)
Password: password123
URL: http://localhost:5173
\`\`\`

---

## 📁 Project Structure

\`\`\`
peer-review-platform/
├── client/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── pages/              # Page components
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── TeacherLogin.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css           # Tailwind + custom styles
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                      # Backend (Express.js)
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── uploads/                 # File upload directory
│   ├── index.js                # Main server file
│   ├── seed.js                 # Database seeding script
│   └── package.json
│
└── README.md
\`\`\`

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (teacher only)
- `GET /api/projects/:id` - Get project details

### Submissions
- `POST /api/submissions` - Create submission
- `GET /api/submissions/my` - Get user's submissions
- `GET /api/submissions/all` - Get all submissions

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/my` - Get user's reviews

### Assignments
- `POST /api/assignments` - Create assignment (teacher only)
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/my` - Get user's assignments
- `PUT /api/assignments/:id/status` - Update assignment status

### Notifications
- `GET /api/notifications/my` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Analytics
- `GET /api/analytics/overview` - Get overview stats (teacher only)
- `GET /api/analytics/student/:id` - Get student analytics
- `GET /api/analytics/project/:id` - Get project analytics

### Comments
- `POST /api/comments` - Create comment
- `GET /api/submissions/:id/comments` - Get submission comments

---

## 🎨 UI Features

- **Dual Login System**: Separate, themed login pages for students and teachers
- **Modern Dark Theme**: Professional slate color scheme with vibrant accents
- **Smooth Animations**: Fade-in, slide-up, and hover effects throughout
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Card-Based Layout**: Beautiful project and submission cards
- **Modal Dialogs**: Clean modals for forms and detailed views
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton screens and spinners

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based access control (Student/Teacher)
- Protected API routes with middleware
- Input validation and sanitization
- File type restrictions for uploads

---

## 📝 Database Schema

### Models
- **User**: Students and teachers with roles
- **Project**: Course projects created by teachers
- **Submission**: Student project submissions with files
- **Review**: Peer reviews with ratings (1-5 stars)
- **Comment**: Collaboration comments
- **Assignment**: Teacher-assigned peer reviews
- **Notification**: User notifications

---

## 🧪 Testing the Application

### 1. Teacher Workflow
1. Login at `/teacher-login` with `teacher@example.com`
2. View all projects on the dashboard
3. Create a new project
4. View student submissions
5. Assign peer reviewers
6. Check analytics dashboard

### 2. Student Workflow
1. Login at `/` with `student1@example.com`
2. View available projects
3. Submit a project with image and PDF
4. View assigned peer submissions
5. Write a review with rating and feedback
6. Add collaboration comments

---

## 🚀 Deployment

### Backend (Node.js)
Deploy to platforms like:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**

### Frontend (React)
Deploy to platforms like:
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Database
For production, consider migrating from SQLite to:
- **PostgreSQL** (recommended)
- **MySQL**
- **MongoDB**

---

## 🔧 Environment Variables

### Server (`.env`)
\`\`\`env
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-key-change-this
PORT=3000
\`\`\`

### Client (optional `.env`)
\`\`\`env
VITE_API_URL=http://localhost:3000
\`\`\`

---

## 📚 Scripts

### Server
\`\`\`bash
npm run dev          # Start development server
npm start            # Start production server
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma migrate dev  # Run database migrations
\`\`\`

### Client
\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
\`\`\`

---

## 🤝 Contributing

This is a hackathon project built for demonstration purposes. Feel free to fork, modify, and enhance!

---

## 📄 License

MIT License - feel free to use this project for educational purposes.

---

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Export analytics to PDF
- [ ] Email notifications
- [ ] Cloud file storage (Cloudinary/Firebase)
- [ ] Advanced search and filtering
- [ ] Rubric-based grading
- [ ] Group project support
- [ ] Mobile app version
- [ ] Dark/Light mode toggle
- [ ] Multi-language support

---

## 💡 Built With Love

Created for hackathons to demonstrate full-stack development skills with modern web technologies.

**Happy Reviewing! 🎓**
