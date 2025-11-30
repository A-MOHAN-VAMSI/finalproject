import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Toast, Badge, StarRating, StarSelector, StatCard, CreateProjectModal, ReviewModal, AssignReviewerModal, SubmitWorkModal, ProjectDetailsModal } from '../components/CommonComponents';

export default function StudentDashboard() {
    const { user, token, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState('projects'); // projects, submissions, assignments
    const [studentTab, setStudentTab] = useState('active'); // active, pending, completed

    const [showSubmit, setShowSubmit] = useState(false);
    const [showReview, setShowReview] = useState(null);
    const [showAssign, setShowAssign] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        fetchData();
    }, [activeTab, studentTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'projects') {
                const res = await fetch('http://localhost:3001/api/projects', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                setProjects(data);
            } else if (activeTab === 'submissions') {
                const res = await fetch('http://localhost:3001/api/submissions/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await res.json();
                setSubmissions(data);
            } else if (activeTab === 'assignments') {
                const res = await fetch('http://localhost:3001/api/assignments', {
                    headers: { 'Authorization': `Bearer ${token}` },
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

    const fetchProjectDetails = async (id) => {
        try {
            const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setSelectedProject(data);
        } catch (err) {
            showToast('Failed to load project details', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-lg">👩‍🎓</span>
                        </div>
                        <span className="font-bold text-white tracking-tight">StudentPortal</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu</div>
                    {['projects', 'submissions', 'assignments'].map(item => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                        >
                            <span>{item === 'projects' ? '📚' : item === 'submissions' ? '📝' : '👥'}</span> {item.charAt(0).toUpperCase() + item.slice(1)}
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
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-800 text-slate-400 text-sm hover:bg-slate-800 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize">Student Dashboard</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {activeTab === 'projects' ? 'Browse and submit to projects.' : activeTab === 'submissions' ? 'Your submissions.' : 'Peer review assignments.'}
                        </p>
                    </div>

                </header>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div></div>
                ) : (
                    <>
                        {activeTab === 'projects' && (
                            <>
                                {/* Student project categorization tabs */}
                                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 mb-4">
                                    {['active', 'pending', 'completed'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setStudentTab(tab)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize ${studentTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.filter(p => {
                                        if (studentTab === 'completed') return p.isSubmitted;
                                        if (studentTab === 'pending') return !p.isSubmitted;
                                        return true; // active
                                    }).map(project => (
                                        <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all cursor-pointer" onClick={() => fetchProjectDetails(project.id)}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">{project.title}</h3>
                                                <Badge color="blue">{project._count.submissions} Subs</Badge>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                            {project.tags && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.tags.split(',').map((tag, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">{tag.trim()}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                                <span className="text-xs text-slate-500">By {project.teacher.name}</span>
                                                <span className="text-xs font-medium text-slate-400">Due {new Date(project.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activeTab === 'submissions' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {submissions.map(submission => (
                                    <SubmissionCard key={submission.id} submission={submission} user={user} onReview={() => setShowReview(submission)} />
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
                                        {assignments.map(assignment => (
                                            <tr key={assignment.id} className="hover:bg-slate-800/50">
                                                <td className="p-4 text-white">{assignment.reviewer.name}</td>
                                                <td className="p-4 text-slate-300">{assignment.submission.student.name}</td>
                                                <td className="p-4 text-slate-400">{assignment.submission.project.title}</td>
                                                <td className="p-4">
                                                    <Badge color={assignment.status === 'COMPLETED' ? 'green' : 'yellow'}>{assignment.status}</Badge>
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
            {selectedProject && (
                <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} onSubmit={() => setShowSubmit(true)} onReview={(sub) => setShowReview(sub)} />
            )}

            {showSubmit && selectedProject && (
                <SubmitWorkModal token={token} projectId={selectedProject.id} onClose={() => setShowSubmit(false)} onSuccess={() => { setShowSubmit(false); fetchProjectDetails(selectedProject.id); showToast('Work submitted successfully!'); }} />
            )}
            {showReview && (
                <ReviewModal submission={showReview} token={token} userRole={user?.role} onClose={() => setShowReview(null)} onSuccess={() => { setShowReview(null); fetchData(); showToast('Review submitted successfully!'); }} />
            )}
            {showAssign && (
                <AssignReviewerModal submission={showAssign} token={token} onClose={() => setShowAssign(null)} onSuccess={() => { setShowAssign(null); showToast('Reviewer assigned successfully!'); fetchData(); }} />
            )}
        </div>
    );
}

// Reuse SubmissionCard from TeacherDashboard (you may extract to a shared file later)
function SubmissionCard({ submission, user, onReview }) {
    const avgRating = submission.reviews?.length ? (submission.reviews.reduce((a, b) => a + b.score, 0) / submission.reviews.length).toFixed(1) : 0;
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            {submission.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img src={`http://localhost:3001${submission.imageUrl}`} alt="Submission" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                </div>
            )}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="text-base font-semibold text-white flex items-center gap-2">
                            {submission.student.name}
                            {submission.studentId === user.id && <Badge color="blue">You</Badge>}
                        </h4>
                        <div className="text-xs text-slate-500 mt-1">{submission.project?.title}</div>
                    </div>
                    {submission.reviews?.length > 0 && (
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <span className="text-sm">★</span>
                                <span className="font-bold text-sm">{avgRating}</span>
                            </div>
                            <span className="text-xs text-slate-600">{submission.reviews.length} reviews</span>
                        </div>
                    )}
                    {submission.points != null && (
                        <div className="ml-4 flex flex-col items-end">
                            <div className="flex items-center gap-1 text-emerald-400">
                                <span className="text-sm">🏆</span>
                                <span className="font-bold text-sm">{submission.points}/100</span>
                            </div>
                            <span className="text-xs text-slate-600">Score</span>
                        </div>
                    )}
                </div>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{submission.content}</p>
                {submission.fileUrl && (
                    <a href={`http://localhost:3001${submission.fileUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 mb-4 px-3 py-2 bg-blue-900/10 rounded border border-blue-900/20 transition-colors">
                        <span>📎</span> View Attached File
                    </a>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-600">{new Date(submission.createdAt).toLocaleDateString()}</div>
                    {submission.studentId !== user.id && (
                        <button onClick={onReview} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors">
                            {user.role === 'TEACHER' ? 'Grade' : 'Review'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
