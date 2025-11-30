import React, { useState, useEffect } from 'react';

// Toast Component
export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-3 animate-enter ${styles[type]}`}>
            <span className="text-lg">{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
};

// Badge Component
export const Badge = ({ children, color = 'slate' }) => {
    const colors = {
        slate: 'bg-slate-800 text-slate-300 border-slate-700',
        blue: 'bg-blue-900/30 text-blue-300 border-blue-800',
        green: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
        purple: 'bg-purple-900/30 text-purple-300 border-purple-800',
        yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>{children}</span>
    );
};

// StarRating Component
export const StarRating = ({ score, maxStars = 5 }) => (
    <div className="flex gap-0.5">
        {[...Array(maxStars)].map((_, i) => (
            <span key={i} className={`text-sm ${i < score ? 'text-yellow-500' : 'text-slate-700'}`}>★</span>
        ))}
    </div>
);

// StarSelector Component
export const StarSelector = ({ value, onChange }) => {
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
                    className={`text-2xl transition-colors ${star <= (hover || value) ? 'text-yellow-500' : 'text-slate-700 hover:text-yellow-500/50'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

// StatCard Component (used in TeacherDashboard)
export const StatCard = ({ label, value, icon, color }) => {
    const colors = {
        blue: 'bg-blue-500/10 text-blue-500',
        purple: 'bg-purple-500/10 text-purple-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
    };
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

// CreateProjectModal Component
export const CreateProjectModal = ({ token, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', description: '', tags: '', dueDate: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Tags</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ReviewModal Component (used for grading)
export const ReviewModal = ({ submission, token, userRole, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ points: submission.points || '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (userRole === 'TEACHER' && formData.points !== '') {
                await fetch(`http://localhost:3001/api/submissions/${submission.id}/grade`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ points: formData.points }),
                });
            }
            onSuccess();
        } catch (err) {
            alert('Failed to submit grade');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">Grade Submission</h2>
                <p className="text-slate-500 text-sm mb-6">Grading work by <span className="text-white font-medium">{submission.student.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Grade (Points 0-100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={formData.points}
                            onChange={e => setFormData({ points: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                            {loading ? 'Saving...' : 'Save Grade'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// AssignReviewerModal Component
export const AssignReviewerModal = ({ submission, token, onClose, onSuccess }) => {
    const [reviewerId, setReviewerId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch('http://localhost:3001/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ projectId: submission.projectId, submissionId: submission.id, reviewerId, dueDate }),
            });
            onSuccess();
        } catch (err) {
            alert('Failed to assign reviewer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-800 shadow-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Assign Peer Reviewer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Reviewer ID (Student ID)</label>
                        <input
                            type="number"
                            required
                            placeholder="Enter Student ID"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={reviewerId}
                            onChange={e => setReviewerId(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Enter the ID of the student who should review this work.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Review Due Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                            {loading ? 'Assigning...' : 'Assign Reviewer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// SubmitWorkModal Component (used by StudentDashboard)
export const SubmitWorkModal = ({ token, projectId, onClose, onSuccess }) => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [projectFile, setProjectFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProjectFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('projectId', projectId);
            formData.append('content', content);
            if (imageFile) formData.append('image', imageFile);
            if (projectFile) formData.append('file', projectFile);

            await fetch('http://localhost:3001/api/submissions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
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
            <div className="bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6">Submit Your Work</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            required
                            rows="5"
                            placeholder="Describe your submission, approach, and any relevant details..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none placeholder-slate-600"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">Provide a clear description of your work and methodology</p>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Project Image <span className="text-slate-500">(Optional)</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer block">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-2 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-2">🖼️</div>
                                        <p className="text-slate-400 text-sm mb-1">Click to upload an image</p>
                                        <p className="text-slate-600 text-xs">JPEG, JPG, or PNG (Max 10MB)</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Project File <span className="text-slate-500">(Optional)</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                            <input
                                type="file"
                                accept=".pdf,.zip"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer block">
                                {projectFile ? (
                                    <div className="flex items-center justify-between bg-slate-950 rounded-lg p-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">📎</span>
                                            <div>
                                                <p className="text-white text-sm font-medium">{projectFile.name}</p>
                                                <p className="text-slate-500 text-xs">{(projectFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setProjectFile(null); }}
                                            className="bg-red-600 hover:bg-red-500 text-white rounded-full px-3 py-1 text-xs"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <div className="text-4xl mb-2">📄</div>
                                        <p className="text-slate-400 text-sm mb-1">Click to upload a file</p>
                                        <p className="text-slate-600 text-xs">PDF or ZIP (Max 10MB)</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Submit Work'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ProjectDetailsModal Component (used by both dashboards)
export const ProjectDetailsModal = ({ project, onClose, onSubmit, onReview }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-800 shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">{project.title}</h2>
            <p className="text-slate-300 mb-2">{project.description}</p>
            <p className="text-sm text-slate-500 mb-4">Due: {new Date(project.dueDate).toLocaleDateString()}</p>

            {/* Submissions List */}
            {project.submissions && project.submissions.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Submissions ({project.submissions.length})</h3>
                    <div className="space-y-3">
                        {project.submissions.map(sub => (
                            <div key={sub.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-white font-medium">{sub.student.name}</p>
                                        <p className="text-slate-400 text-sm line-clamp-2">{sub.content}</p>
                                    </div>
                                    {onReview && (
                                        <button
                                            onClick={() => onReview(sub)}
                                            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm"
                                        >
                                            Review
                                        </button>
                                    )}
                                </div>
                                {sub.reviews && sub.reviews.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-2">{sub.reviews.length} reviews</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white">Close</button>
                {onSubmit && (
                    <button onClick={onSubmit} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Submit Work</button>
                )}
            </div>
        </div>
    </div>
);
