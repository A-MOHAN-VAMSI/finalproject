import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Toast,
    Badge,
    StatCard,
    CreateProjectModal,
    ReviewModal,
    AssignReviewerModal
} from '../components/CommonComponents';

export default function TeacherDashboard() {
    const { user, logout, token } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics');
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Modals
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showReview, setShowReview] = useState(null);
    const [showAssign, setShowAssign] = useState(null); // Submission to assign

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'analytics') {
                const res = await fetch('http://localhost:3001/api/analytics/overview', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setAnalytics(data);
            } else if (activeTab === 'projects') {
                const res = await fetch('http://localhost:3001/api/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setProjects(data);
            } else if (activeTab === 'submissions') {
                const res = await fetch('http://localhost:3001/api/submissions/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setSubmissions(data);
            } else if (activeTab === 'assignments') {
                const res = await fetch('http://localhost:3001/api/assignments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setAssignments(data);
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-lg">👨‍🏫</span>
                        </div>
                        <span className="font-bold text-white tracking-tight">TeacherPortal</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu</div>
                    {[
                        { id: 'analytics', icon: '📊', label: 'Analytics' },
                        { id: 'projects', icon: '📚', label: 'Projects' },
                        { id: 'submissions', icon: '📝', label: 'Submissions' },
                        { id: 'assignments', icon: '👥', label: 'Assignments' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <span>{item.icon}</span> {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                            <div className="text-xs text-slate-500 truncate">{user?.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-400 text-sm hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize">
                            {activeTab}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {activeTab === 'analytics' && 'Overview of course performance.'}
                            {activeTab === 'projects' && 'Manage course projects.'}
                            {activeTab === 'submissions' && 'Review and grade student work.'}
                            {activeTab === 'assignments' && 'Manage peer review assignments.'}
                        </p>
                    </div>
                    {activeTab === 'projects' && (
                        <button
                            onClick={() => setShowCreateProject(true)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            <span>+</span> New Project
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'analytics' && analytics && (
                            <div className="space-y-6">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <StatCard label="Total Projects" value={analytics.overview.totalProjects} icon="📚" color="blue" />
                                    <StatCard label="Total Submissions" value={analytics.overview.totalSubmissions} icon="📝" color="purple" />
                                    <StatCard label="Avg Rating" value={analytics.overview.avgRating} icon="⭐" color="yellow" />
                                    <StatCard label="Completion Rate" value={`${analytics.overview.completionRate}%`} icon="📈" color="emerald" />
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {analytics.recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">
                                                        {activity.reviewer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-300">
                                                            <span className="font-medium text-white">{activity.reviewer.name}</span> reviewed <span className="font-medium text-white">{activity.submission.student.name}</span>'s work
                                                        </p>
                                                        <p className="text-xs text-slate-500">{activity.submission.project.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-500 text-sm">★ {activity.score}</span>
                                                    <span className="text-xs text-slate-600">{new Date(activity.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'projects' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                            <Badge color="blue">{project._count.submissions} Subs</Badge>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                            <span className="text-xs text-slate-500">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="text-base font-semibold text-white">{submission.student.name}</h4>
                                                <div className="text-xs text-slate-500">{submission.project.title}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setShowAssign(submission)}
                                                    className="px-2 py-1 text-xs bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded hover:bg-blue-900/50"
                                                >
                                                    Assign Reviewer
                                                </button>
                                                <button
                                                    onClick={() => setShowReview(submission)}
                                                    className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded hover:bg-emerald-900/50"
                                                >
                                                    Grade
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{submission.content}</p>
                                        {submission.points && (
                                            <div className="text-xs text-emerald-400 font-medium">Score: {submission.points}/100</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-950 text-slate-400">
                                        <tr>
                                            <th className="p-4 font-medium">Reviewer</th>
                                            <th className="p-4 font-medium">Student (Author)</th>
                                            <th className="p-4 font-medium">Project</th>
                                            <th className="p-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {assignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-slate-800/50">
                                                <td className="p-4 text-white">{assignment.reviewer.name}</td>
                                                <td className="p-4 text-slate-300">{assignment.submission.student.name}</td>
                                                <td className="p-4 text-slate-400">{assignment.submission.project.title}</td>
                                                <td className="p-4">
                                                    <Badge color={assignment.status === 'COMPLETED' ? 'green' : 'yellow'}>
                                                        {assignment.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modals */}
            {showCreateProject && (
                <CreateProjectModal
                    token={token}
                    onClose={() => setShowCreateProject(false)}
                    onSuccess={() => {
                        setShowCreateProject(false);
                        fetchData();
                        showToast('Project created successfully!');
                    }}
                />
            )}

            {showReview && (
                <ReviewModal
                    submission={showReview}
                    token={token}
                    userRole="TEACHER"
                    onClose={() => setShowReview(null)}
                    onSuccess={() => {
                        setShowReview(null);
                        fetchData();
                        showToast('Grade submitted successfully!');
                    }}
                />
            )}

            {showAssign && (
                <AssignReviewerModal
                    submission={showAssign}
                    token={token}
                    onClose={() => setShowAssign(null)}
                    onSuccess={() => {
                        setShowAssign(null);
                        showToast('Reviewer assigned successfully!');
                    }}
                />
            )}
        </div>
    );
}
