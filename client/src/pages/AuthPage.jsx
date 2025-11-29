import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'STUDENT'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.name, formData.role);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950">
            {/* Left Side - Brand/Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900"></div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <span className="text-xl">🎓</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PeerCollab</span>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Elevate your learning through <span className="text-blue-500">peer collaboration</span>.
                        </h2>
                        <p className="text-slate-400 text-lg max-w-md">
                            Join thousands of students and teachers in a professional environment designed for constructive feedback and academic growth.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>© 2025 PeerCollab Inc.</span>
                        <span>•</span>
                        <span>Privacy Policy</span>
                        <span>•</span>
                        <span>Terms</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p className="text-slate-400">
                            {isLogin ? 'Enter your details to access your dashboard.' : 'Start your journey with us today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required={!isLogin}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300">I am a</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.role === 'STUDENT'
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'TEACHER' })}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${formData.role === 'TEACHER'
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        Teacher
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-slate-400 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
