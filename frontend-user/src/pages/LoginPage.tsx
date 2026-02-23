import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Buildings, EnvelopeSimple, Lock, User, Phone, Briefcase, X } from '@phosphor-icons/react';

interface LoginPageProps {
    onSuccess: () => void;
    isModal?: boolean;
    onClose?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, isModal, onClose }) => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Register form
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regDept, setRegDept] = useState('');
    const [regPhone, setRegPhone] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Generate a user ID: U-<timestamp>
            const uid = `U-${Date.now().toString().slice(-6)}`;
            await register({ uid, name: regName, email: regEmail, password: regPassword, dept: regDept, phone_no: regPhone });
            // Auto-login after registration
            await login(regEmail, regPassword);
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const content = (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
            {isModal && onClose && (
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
                    <X size={24} />
                </button>
            )}
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Buildings size={22} weight="fill" className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Conference Rooms</h1>
                    <p className="text-xs text-slate-500">Booking System</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
                <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Register
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <EnvelopeSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-2">
                        Demo: alice@company.com / password123
                    </p>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Full Name" value={regName} onChange={e => setRegName(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                    </div>
                    <div className="relative">
                        <EnvelopeSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" placeholder="Email address" value={regEmail} onChange={e => setRegEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                    </div>
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                    </div>
                    <div className="relative">
                        <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Department" value={regDept} onChange={e => setRegDept(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                    </div>
                    <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="tel" placeholder="Phone number" value={regPhone} onChange={e => setRegPhone(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative z-10 w-full max-w-md">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
            {content}
        </div>
    );
};

export default LoginPage;
