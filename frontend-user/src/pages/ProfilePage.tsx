import {
    Envelope,
    Phone,
    Briefcase,
    Gear,
    Shield,
    SignOut
} from '@phosphor-icons/react';


const ProfilePage = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm sticky top-24">
                        <div className="w-24 h-24 bg-primary text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4 ring-4 ring-slate-50">
                            JD
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">John Doe</h2>
                        <p className="text-slate-500 text-sm">Product Manager</p>

                        <div className="mt-6 flex justify-center gap-2">
                            <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">Engineering</span>
                            <span className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">Lead</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-left space-y-4">
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Envelope size={18} className="text-primary" />
                                <span>john.doe@company.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Phone size={18} className="text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Briefcase size={18} className="text-primary" />
                                <span>Employee ID: EMP-2024</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                            <div className="text-3xl font-bold text-slate-900">24</div>
                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-bold">Total Bookings</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                            <div className="text-3xl font-bold text-primary">150</div>
                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-bold">Hours Saved</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                            <div className="text-3xl font-bold text-accent-orange">5</div>
                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-bold">Pending</div>
                        </div>
                    </div>

                    {/* Settings Sections */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Gear size={20} /> Application Settings
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800">Email Notifications</p>
                                    <p className="text-sm text-slate-500">Receive emails about booking updates</p>
                                </div>
                                <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800">Calendar Sync</p>
                                    <p className="text-sm text-slate-500">Auto-add bookings to your calendar</p>
                                </div>
                                <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Shield size={20} /> Security
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <button className="w-full text-left flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                                <span className="text-slate-700 font-medium">Change Password</span>
                                <span className="text-slate-400 group-hover:text-primary text-sm">Update</span>
                            </button>
                            <button className="w-full text-left flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                                <span className="text-slate-700 font-medium">Two-Factor Authentication</span>
                                <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">Enabled</span>
                            </button>
                        </div>
                    </div>

                    <button className="w-full py-4 text-red-500 font-bold bg-white border border-red-100 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2">
                        <SignOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
