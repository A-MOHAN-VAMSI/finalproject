import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function StudentLogin() {
    const { setAuth } = useAuth();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
            const body = isRegisterMode
                ? { ...formData, role: 'STUDENT' }
                : { email: formData.email, password: formData.password };

            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                if (data.user.role !== 'STUDENT') {
                    setError('This is for students only. Please use the teacher login.');
                    setIsLoading(false);
                    return;
                }
                setAuth(data.token, data.user);
            } else {
                setError(data.error || (isRegisterMode ? 'Registration failed' : 'Login failed'));
                setIsLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/50">
                        <span className="text-3xl">🎓</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Student Portal
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {isRegisterMode ? 'Create your student account' : 'Sign in to collaborate and review peer projects'}
                    </p>
                </div>

                {/* Login/Register Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl shadow-black/20 animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        {isRegisterMode && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="student@example.com"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    {isRegisterMode ? 'Creating account...' : 'Signing in...'}
                                </span>
                            ) : (isRegisterMode ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    {/* Toggle between Login/Register */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setError('');
                                setFormData({ email: '', password: '', name: '' });
                            }}
                            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                        >
                            {isRegisterMode ? '← Back to Sign In' : "Don't have an account? Create one →"}
                        </button>
                    </div>

                    {/* Demo Account Info */}
                    {!isRegisterMode && (
                        <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                            <p className="text-xs text-indigo-300 font-medium mb-2">Demo Accounts:</p>
                            <p className="text-xs text-slate-400 font-mono">student1@example.com</p>
                            <p className="text-xs text-slate-400 font-mono">Password: password123</p>
                        </div>
                    )}

                    {/* Teacher Login Link */}
                    <div className="mt-6 text-center">
                        <a
                            href="/teacher-login"
                            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
                        >
                            👨‍🏫 Teacher? Login here
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-slate-600">
                    <p>Peer Review & Collaboration Platform</p>
                </div>
            </div>
        </div>
    );
}
