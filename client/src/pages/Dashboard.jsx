import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// --- UI Components ---

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-3 animate-enter ${styles[type]}`}>
            <span className="text-lg">{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
};

const StarRating = ({ score, maxStars = 5 }) => {
    return (
        <div className="flex gap-0.5">
            {[...Array(maxStars)].map((_, i) => (
                <span key={i} className={`text-sm ${i < score ? 'text-yellow-500' : 'text-slate-700'}`}>★</span>
            ))}
        </div>
    );
};

const StarSelector = ({ value, onChange }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-2xl transition-colors ${star <= (hover || value) ? 'text-yellow-500' : 'text-slate-700 hover:text-yellow-500/50'
                        }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const Badge = ({ children, color = 'slate' }) => {
    const colors = {
        slate: 'bg-slate-800 text-slate-300 border-slate-700',
        blue: 'bg-blue-900/30 text-blue-300 border-blue-800',
        green: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
        purple: 'bg-purple-900/30 text-purple-300 border-purple-800'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
            {children}
        </span>
    );
};

// --- Main Dashboard Component ---

export default function Dashboard() {
    const { user, logout, token } = useAuth();
    const [projects, setProjects] = useState([]);
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState('projects');
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showSubmit, setShowSubmit] = useState(false);
    const [showReview, setShowReview] = useState(null);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        fetchProjects();
        if (user?.role === 'TEACHER' || activeTab === 'all-submissions') {
            fetchAllSubmissions();
        }
    }, [activeTab]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            showToast('Failed to load projects', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllSubmissions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/submissions/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAllSubmissions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjectDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSelectedProject(data);
        } catch (err) {
            showToast('Failed to load project details', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🎓</span>
                        </div>
                        <span className="font-bold text-white tracking-tight">PeerCollab</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu</div>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <span>📚</span> Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('all-submissions')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all-submissions'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                            }`}
                    >
                        <span>{user?.role === 'TEACHER' ? '📝' : '👥'}</span>
                        {user?.role === 'TEACHER' ? 'All Submissions' : 'Peer Submissions'}
                    </button>
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
                        <h1 className="text-2xl font-bold text-white">
                            {activeTab === 'projects' ? 'Projects' : 'Submissions'}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {activeTab === 'projects'
                                ? 'Manage and view all course projects.'
                                : 'Review and grade student submissions.'}
                        </p>
                    </div>

                    {user?.role === 'TEACHER' && activeTab === 'projects' && (
                        <button
                            onClick={() => setShowCreateProject(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            <span>+</span> New Project
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'projects' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => fetchProjectDetails(project.id)}
                                        className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all cursor-pointer hover:shadow-lg hover:shadow-black/20"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <Badge color="blue">{project._count.submissions} Subs</Badge>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {project.tags && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.tags.split(',').map((tag, i) => (
                                                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                                            <div className="text-xs text-slate-500">
                                                By {project.teacher.name}
                                            </div>
                                            <div className="text-xs font-medium text-slate-400">
                                                Due {new Date(project.dueDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'all-submissions' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {allSubmissions.map((submission) => (
                                    <SubmissionCard
                                        key={submission.id}
                                        submission={submission}
                                        user={user}
                                        onReview={() => setShowReview(submission)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modals */}
            {selectedProject && (
                <ProjectDetailsModal
                    project={selectedProject}
                    user={user}
                    onClose={() => setSelectedProject(null)}
                    onSubmit={() => setShowSubmit(true)}
                    onReview={(sub) => setShowReview(sub)}
                />
            )}

            {showCreateProject && (
                <CreateProjectModal
                    token={token}
                    onClose={() => setShowCreateProject(false)}
                    onSuccess={() => {
                        setShowCreateProject(false);
                        fetchProjects();
                        showToast('Project created successfully!');
                    }}
                />
            )}

            {showSubmit && (
                <SubmitWorkModal
                    projectId={selectedProject.id}
                    token={token}
                    onClose={() => setShowSubmit(false)}
                    onSuccess={() => {
                        setShowSubmit(false);
                        fetchProjectDetails(selectedProject.id);
                        showToast('Work submitted successfully!');
                    }}
                />
            )}

            {showReview && (
                <ReviewModal
                    submission={showReview}
                    token={token}
                    userRole={user?.role}
                    onClose={() => setShowReview(null)}
                    onSuccess={() => {
                        setShowReview(null);
                        if (activeTab === 'all-submissions') fetchAllSubmissions();
                        if (selectedProject) fetchProjectDetails(selectedProject.id);
                        showToast('Review submitted successfully!');
                    }}
                />
            )}
        </div>
    );
}

// --- Sub-Components ---

function SubmissionCard({ submission, user, onReview }) {
    const avgRating = submission.reviews?.length
        ? (submission.reviews.reduce((a, b) => a + b.score, 0) / submission.reviews.length).toFixed(1)
        : 0;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            {submission.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                        src={`http://localhost:3000${submission.imageUrl}`}
                        alt="Submission"
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>
            )}

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="text-base font-semibold text-white flex items-center gap-2">
                            {submission.student.name}
                            {submission.studentId === user.id && (
                                <Badge color="blue">You</Badge>
                            )}
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
                </div>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{submission.content}</p>

                {submission.fileUrl && (
                    <a
                        href={`http://localhost:3000${submission.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 mb-4 px-3 py-2 bg-blue-900/10 rounded border border-blue-900/20 transition-colors"
                    >
                        <span>📎</span> View Attached File
                    </a>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="text-xs text-slate-600">
                        {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                    {submission.studentId !== user.id && (
                        <button
                            onClick={onReview}
                            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors"
                        >
                            {user.role === 'TEACHER' ? 'Grade' : 'Review'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProjectDetailsModal({ project, user, onClose, onSubmit, onReview }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-enter">
            <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{project.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">👨‍🏫 {project.teacher.name}</span>
                            <span className="flex items-center gap-1">📅 Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                        <p className="text-slate-300 leading-relaxed">{project.description}</p>
                    </div>

                    {user.role === 'STUDENT' && (
                        <div className="mb-10 p-5 bg-blue-900/10 border border-blue-900/20 rounded-lg flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-200 mb-1">Ready to submit?</h3>
                                <p className="text-xs text-blue-300/70">Upload your work for review.</p>
                            </div>
                            <button
                                onClick={onSubmit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                                Submit Work
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Submissions <Badge>{project.submissions.length}</Badge>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.submissions.map((sub) => (
                            <SubmissionCard
                                key={sub.id}
                                submission={sub}
                                user={user}
                                onReview={() => onReview(sub)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CreateProjectModal({ token, onClose, onSuccess }) {
    const [formData, setFormData] = useState({ title: '', description: '', tags: '', dueDate: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            onSuccess();
        } catch (err) {
            alert('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags (comma separated)</label>
                        <input
                            type="text"
                            placeholder="Web, AI, Design..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-colors">
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SubmitWorkModal({ projectId, token, onClose, onSuccess }) {
    const [content, setContent] = useState('');
    const [files, setFiles] = useState({ image: null, file: null });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('content', content);
        if (files.image) formData.append('image', files.image);
        if (files.file) formData.append('file', files.file);

        try {
            await fetch('http://localhost:3000/api/submissions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            onSuccess();
        } catch (err) {
            alert('Failed to submit work');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Submit Your Work</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Description / Links</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setFiles({ ...files, image: e.target.files[0] })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="bg-slate-950 border border-dashed border-slate-800 rounded-lg p-4 text-center group-hover:border-blue-500 transition-colors">
                                    <span className="text-xl block mb-1">🖼️</span>
                                    <span className="text-xs text-slate-500">{files.image ? files.image.name : 'Upload Image'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Project File (PDF/Zip)</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept=".pdf,.zip,.rar"
                                    onChange={e => setFiles({ ...files, file: e.target.files[0] })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="bg-slate-950 border border-dashed border-slate-800 rounded-lg p-4 text-center group-hover:border-blue-500 transition-colors">
                                    <span className="text-xl block mb-1">📎</span>
                                    <span className="text-xs text-slate-500">{files.file ? files.file.name : 'Upload File'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-colors">
                            {loading ? 'Uploading...' : 'Submit Work'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ReviewModal({ submission, token, userRole, onClose, onSuccess }) {
    const [formData, setFormData] = useState({ content: '', score: 3 });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ submissionId: submission.id, ...formData })
            });
            onSuccess();
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">
                    {userRole === 'TEACHER' ? 'Grade Submission' : 'Peer Review'}
                </h2>
                <p className="text-slate-500 text-sm mb-6">Reviewing work by <span className="text-white font-medium">{submission.student.name}</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center p-4 bg-slate-950 rounded-lg border border-slate-800">
                        <label className="text-xs font-medium text-slate-400 mb-2">Overall Rating</label>
                        <StarSelector value={formData.score} onChange={score => setFormData({ ...formData, score })} />
                        <div className="text-slate-400 text-xs font-medium mt-2">{formData.score} out of 5 stars</div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Feedback & Comments</label>
                        <textarea
                            required
                            rows="5"
                            placeholder="Provide constructive feedback..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition-colors">
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
