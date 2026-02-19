import {
    CheckCircle,
    DownloadSimple,
    Printer,
    MapPin,
    CalendarBlank,
    Clock,
    Users,
    ShieldCheck,
    WarningCircle,
    ForkKnife,
    FileText
} from '@phosphor-icons/react';
import React from 'react';
import Footer from '../components/Footer';

const TicketPage = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Summary */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-3 text-green-600 mb-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <CheckCircle size={32} weight="fill" />
                        <div>
                            <h2 className="font-bold text-lg">Booking Confirmed!</h2>
                            <p className="text-sm text-green-800">Your reservation has been successfully created.</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Executive Boardroom</h3>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</label>
                                    <p className="font-medium text-slate-800">Downtown Office</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Capacity</label>
                                    <p className="font-medium text-slate-800">12 People</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Purpose</label>
                                    <p className="font-medium text-slate-800">Team Strategy Meeting</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <ForkKnife size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Food Service</label>
                                    <p className="font-medium text-slate-800">No</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Ticket */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative">
                        {/* Ticket Header */}
                        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck size={120} />
                            </div>
                            <h3 className="text-2xl font-bold mb-1">RoomBook</h3>
                            <p className="text-slate-400 text-sm">Official Entry Pass</p>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-6 relative">
                            {/* Perforated Line Effect */}
                            <div className="absolute top-0 left-0 right-0 h-4 -mt-2 z-10">
                                <div className="h-4 w-full bg-white rounded-[20px] absolute -top-2"></div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <label className="text-xs text-slate-500">Date</label>
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            <CalendarBlank size={16} className="text-primary" />
                                            2026-02-12
                                        </div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-slate-200"></div>
                                    <div className="text-right">
                                        <label className="text-xs text-slate-500">Time</label>
                                        <div className="font-bold text-slate-900 flex items-center gap-2 justify-end">
                                            11:00 AM
                                            <Clock size={16} className="text-primary" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                                    <WarningCircle size={24} className="text-yellow-600 shrink-0" />
                                    <div className="text-xs text-yellow-800 leading-relaxed">
                                        <strong>Important Notice:</strong> Please wait for admin approval. You'll receive an email confirmation once your booking is approved.
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 flex justify-between items-center text-xs text-slate-400">
                                <div className="flex flex-col gap-1">
                                    <span>Generated: 2/12/2026</span>
                                    <span>12:11 PM</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                                    <ShieldCheck size={14} />
                                    Verified Booking
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                <DownloadSimple size={18} /> Download
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                                <Printer size={18} /> Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketPage;
