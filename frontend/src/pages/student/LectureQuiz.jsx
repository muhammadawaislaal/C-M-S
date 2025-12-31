import React, { useEffect, useState } from 'react';
import assessmentsService from '../../services/assessmentsService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    ChevronRight,
    HelpCircle,
    Award,
    ArrowRight,
    RotateCcw,
    Layout as LayoutIcon
} from 'lucide-react';

const LectureQuiz = ({ quizId }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [scoreInfo, setScoreInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!quizId) return;
        (async () => {
            try {
                const res = await assessmentsService.getQuiz(quizId);
                setQuiz(res);
            } catch (e) {
                toast.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        })();
    }, [quizId]);

    const handleSelect = (qId, optId) => {
        setAnswers(prev => ({ ...prev, [qId]: { question_id: qId, selected_option_id: optId } }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < (quiz.questions?.length || 0)) {
            toast.warning('Please answer all questions before submitting.');
            return;
        }

        try {
            const payload = { answers: Object.values(answers) };
            const res = await assessmentsService.submitQuiz(quiz.id, payload);
            setScoreInfo(res);
            setSubmitted(true);
            toast.success(`Quiz completed! Final Score: ${res.score}/${res.max_score}`);
        } catch (e) {
            toast.error('Submission failed');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <RotateCcw className="text-indigo-600 animate-spin" size={32} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Assessment...</span>
        </div>
    );

    if (submitted && scoreInfo) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-12 text-center flex flex-col items-center"
            >
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-[2.5rem] flex items-center justify-center mb-8">
                    <Award size={48} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Quiz Completed!</h2>
                <p className="text-slate-400 text-sm font-medium mb-10 italic">Great effort! Your results are processed.</p>

                <div className="flex items-center gap-12 mb-10">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                        <p className="text-4xl font-extrabold text-indigo-600">{scoreInfo.score}<span className="text-slate-300 text-xl">/{scoreInfo.max_score}</span></p>
                    </div>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(scoreInfo.score / scoreInfo.max_score) * 100}%` }}
                        className="h-full bg-green-500 rounded-full"
                    />
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all"
                >
                    Retake Quiz
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{quiz.title}</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic flex items-center gap-2">
                        <HelpCircle size={14} /> Knowledge assessment session
                    </p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Questions</span>
                    <span className="text-lg font-bold text-indigo-600">{Object.keys(answers).length} <span className="text-slate-300 text-sm">of {quiz.questions?.length}</span></span>
                </div>
            </div>

            <div className="space-y-8 mt-4">
                {quiz.questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="premium-card p-10 group hover:ring-2 hover:ring-indigo-600/5 transition-all"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center shrink-0 text-indigo-600 font-extrabold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="text-xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">{q.prompt}</div>

                                {q.question_type === 'mcq' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map(o => {
                                            const isSelected = answers[q.id]?.selected_option_id === o.id;
                                            return (
                                                <button
                                                    key={o.id}
                                                    onClick={() => handleSelect(q.id, o.id)}
                                                    className={`p-5 rounded-2xl border text-left transition-all relative flex items-center gap-4 ${isSelected
                                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                                                            : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                                                        {isSelected && <CheckCircle size={14} className="text-white" />}
                                                    </div>
                                                    <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{o.text}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {q.question_type !== 'mcq' && (
                                    <textarea
                                        className="w-full mt-2 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[150px]"
                                        placeholder="Type your comprehensive answer here..."
                                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: { question_id: q.id, text_answer: e.target.value } }))}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center pt-10">
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[2rem] text-sm font-bold uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-500 hover:-translate-y-1 transition-all group"
                >
                    Submit Performance <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LectureQuiz;
