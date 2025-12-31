import React, { useState } from 'react';
import commService from '../../services/commService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
    Send,
    User,
    Search,
    MoreHorizontal,
    MessageSquare,
    Clock,
    Paperclip
} from 'lucide-react';

const Messages = () => {
    const [to, setTo] = useState('');
    const [content, setContent] = useState('');

    const send = async () => {
        if (!to || !content) return toast.warning('Please fill all fields');
        try {
            await commService.sendMessage({ to, content });
            toast.success('Message sent successfully 🚀');
            setTo(''); setContent('');
        } catch (e) { toast.error('Send failed. Check recipient ID.'); }
    };

    return (
        <div className="pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Direct Messaging</h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">Communicate directly with students and instructors</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Contacts */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 premium-card flex flex-col h-[600px]"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {[
                            { name: 'John Doe', role: 'Student', last: 'Sir, regarding the quiz...', time: '12:30 PM', active: true },
                            { name: 'Dr. Smith', role: 'Instructor', last: 'Grade submission confirmed.', time: 'Yesterday', active: false },
                            { name: 'Sarah Wilson', role: 'Student', last: 'Thank you for the help!', time: 'Oct 12', active: false }
                        ].map((chat, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${chat.active ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} alt="avatar" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`text-sm font-bold truncate ${chat.active ? 'text-indigo-600' : 'text-slate-800 dark:text-white'}`}>{chat.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">{chat.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 truncate font-medium">{chat.last}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Composer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 premium-card flex flex-col h-[600px]"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Compose Message</h3>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">New Conversation</p>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Recipient ID / Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                                <input
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="Enter user unique identifier..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Message Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type your message here..."
                                className="w-full flex-1 p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-sm min-h-[200px]"
                            ></textarea>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center rounded-b-[2rem]">
                        <div className="flex gap-2">
                            <button className="p-2.5 bg-white dark:bg-slate-900 text-slate-400 rounded-xl hover:text-indigo-600 hover:shadow-md transition-all">
                                <Paperclip size={20} />
                            </button>
                            <button className="p-2.5 bg-white dark:bg-slate-900 text-slate-400 rounded-xl hover:text-indigo-600 hover:shadow-md transition-all">
                                <Clock size={20} />
                            </button>
                        </div>
                        <button
                            onClick={send}
                            className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all"
                        >
                            Send <Send size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Messages;
