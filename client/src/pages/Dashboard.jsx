import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
    const { user, logout, token } = useAuth();
    if (!user) return null; // Loading handled elsewhere
    return (
        <>
            {user.role === 'TEACHER' ? (
                <TeacherDashboard token={token} logout={logout} />
            ) : (
                <StudentDashboard token={token} />
            )}
        </>
    );
}
