import { useState, useEffect } from 'react';

export default function LandingPage() {
    const handleNavigate = (path) => {
        window.location.href = path;
    };

    const [stats, setStats] = useState({
        totalReviews: 0,
        activeUsers: 0,
        projectsCompleted: 0,
        avgRating: 0
    });

    useEffect(() => {
        // Fetch real statistics from the API (optional)
        setStats({
            totalReviews: 1247,
            activeUsers: 342,
            projectsCompleted: 156,
            avgRating: 4.8
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                        </div>
                        <span className="text-xl font-bold text-white">PeerReview</span>
                    </div>
                    <button
                        onClick={() => handleNavigate('/student-login')}
                        className="px-6 py-2 rounded-lg border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                        Sign In
                    </button>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-6 py-20 text-center">
                    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        Elevate Learning Through
                        <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Collaborative Peer Review
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        A modern platform that empowers students and educators to provide meaningful feedback,
                        foster critical thinking, and enhance learning outcomes through structured peer assessment.
                    </p>
                    <button
                        onClick={() => handleNavigate('/student-login')}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 transition-all"
                    >
                        Get Started →
                    </button>
                </div>

                {/* Stats Section */}
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard value={stats.totalReviews.toLocaleString()} label="Total Reviews" icon="⭐" />
                        <StatCard value={stats.activeUsers.toLocaleString()} label="Active Users" icon="👥" />
                        <StatCard value={stats.projectsCompleted.toLocaleString()} label="Projects Completed" icon="✅" />
                        <StatCard value={stats.avgRating} label="Average Rating" icon="🏆" />
                    </div>
                </div>
            </div>

            {/* What is Peer Review Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-bold text-white mb-6 text-center">What is Peer Review?</h2>
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed text-center">
                        Peer review is a collaborative learning process where students evaluate and provide constructive
                        feedback on each other's work. This evidence-based educational practice enhances critical thinking,
                        deepens understanding, and develops professional skills essential for academic and career success.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <FeatureCard
                            icon="🎯"
                            title="Structured Feedback"
                            description="Guided rubrics and criteria ensure consistent, high-quality evaluations"
                        />
                        <FeatureCard
                            icon="💡"
                            title="Critical Thinking"
                            description="Develop analytical skills by evaluating diverse perspectives and approaches"
                        />
                        <FeatureCard
                            icon="🤝"
                            title="Collaborative Learning"
                            description="Build communication skills and learn from peer insights and experiences"
                        />
                    </div>
                </div>
            </section>

            {/* Who Uses It Section */}
            <section className="bg-slate-900/50 backdrop-blur-sm py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-white mb-12 text-center">Who Uses Peer Review?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <UserCard
                            icon="🎓"
                            title="Students"
                            description="Improve work quality through peer feedback and learn by evaluating others"
                        />
                        <UserCard
                            icon="👨‍🏫"
                            title="Educators"
                            description="Scale feedback delivery and gain insights into student understanding"
                        />
                        <UserCard
                            icon="🏫"
                            title="Universities"
                            description="Enhance course outcomes and promote active learning methodologies"
                        />
                        <UserCard
                            icon="💼"
                            title="Professionals"
                            description="Develop workplace skills like constructive criticism and collaboration"
                        />
                    </div>
                </div>
            </section>

            {/* Why Use It Section */}
            <section className="container mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-white mb-12 text-center">Why Choose Our Platform?</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <BenefitCard
                        icon="📊"
                        title="Data-Driven Insights"
                        description="Track progress with comprehensive analytics and performance metrics"
                    />
                    <BenefitCard
                        icon="⚡"
                        title="Streamlined Workflow"
                        description="Intuitive interface makes submission and review processes effortless"
                    />
                    <BenefitCard
                        icon="🔒"
                        title="Secure & Private"
                        description="Your data is protected with enterprise-grade security measures"
                    />
                    <BenefitCard
                        icon="🌟"
                        title="Quality Assurance"
                        description="Built-in rubrics and guidelines ensure meaningful, constructive feedback"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Learning Experience?</h2>
                    <p className="text-xl text-slate-300 mb-8">Join thousands of students and educators already benefiting from peer review</p>
                    <button
                        onClick={() => handleNavigate('/student-login')}
                        className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105 transition-all"
                    >
                        Get Started Now →
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-8">
                <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© 2024 PeerReview Platform. Empowering collaborative learning.</p>
                </div>
            </footer>
        </div>
    );
}

// Component: StatCard
function StatCard({ value, label, icon }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-colors">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}

// Component: FeatureCard
function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

// Component: UserCard
function UserCard({ icon, title, description }) {
    return (
        <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

// Component: BenefitCard
function BenefitCard({ icon, title, description }) {
    return (
        <div className="flex gap-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
            <div className="text-4xl flex-shrink-0">{icon}</div>
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
