import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const OnboardingCard = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Confirm your email', completed: false, description: 'Check your inbox for the activation link.' },
        { id: 2, title: 'Set up your Address', completed: false, description: 'Required for tax and shipping calculations.' },
        { id: 3, title: 'Create a Product', completed: true, description: 'List your first item to start selling.' },
        { id: 4, title: 'Connect your store', completed: false, description: 'Sync with Shopify, Etsy, or WooCommerce.' },
        { id: 5, title: 'Add payment method', completed: false, description: 'Securely link your bank or PayPal account.' },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100;

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-6">
            
            {/* Header Section */}
            <div className="p-8 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#f05a28] rounded-2xl shadow-lg shadow-[0_10px_25px_rgba(240,90,40,0.3)]">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Welcome to your dashboard</h3>
                            <p className="text-sm text-gray-500 font-medium">
                                Complete these steps to unlock all features
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 bg-white p-4 rounded-xl border border-gray-50 shadow-sm">
                        <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">
                                {completedTasks} / {tasks.length} Steps
                            </div>
                            <div className="text-xs text-gray-400">Tasks Completed</div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <svg className="w-14 h-14 transform -rotate-90">
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="24"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={150.8}
                                    strokeDashoffset={150.8 - (150.8 * progress) / 100}
                                    strokeLinecap="round"
                                    className="text-[#f05a28] transition-all duration-700 ease-in-out"
                                />
                            </svg>
                            <span className="absolute text-xs font-black text-[#f05a28]">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-8 overflow-hidden">
                    <div
                        className="bg-[#f05a28] h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(240,90,40,0.4)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`group w-full flex items-center gap-5 p-5 rounded-2xl transition-all duration-200 text-left border ${
                            task.completed
                                ? 'bg-gray-50/50 border-transparent'
                                : 'bg-white border-gray-50 hover:border-[#f05a28]/30 hover:shadow-md hover:shadow-[0_5px_20px_rgba(240,90,40,0.15)]'
                        }`}
                    >
                        <div className="flex-shrink-0">
                            {task.completed ? (
                                <div className="bg-green-500 rounded-full p-1">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                            ) : (
                                <Circle className="w-7 h-7 text-gray-200 group-hover:text-[#f05a28] transition-colors" />
                            )}
                        </div>

                        <div className="flex-1">
                            <h4
                                className={`text-base font-bold transition-all ${
                                    task.completed
                                        ? 'text-gray-400 line-through'
                                        : 'text-gray-800'
                                }`}
                            >
                                {task.title}
                            </h4>
                            <p
                                className={`text-sm mt-0.5 leading-relaxed ${
                                    task.completed
                                        ? 'text-gray-300'
                                        : 'text-gray-500'
                                }`}
                            >
                                {task.description}
                            </p>
                        </div>

                        <div
                            className={`p-2 rounded-full transition-all ${
                                task.completed
                                    ? 'bg-gray-100 opacity-0'
                                    : 'bg-[#f05a28]/10 text-[#f05a28] opacity-100 group-hover:translate-x-1'
                            }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>
                ))}

                {/* Final Goal Card */}
                {!tasks.every(t => t.completed) && (
                    <div className="lg:col-span-2 mt-4 p-6 bg-[#f05a28] rounded-2xl flex items-center justify-between text-white shadow-xl shadow-[0_15px_35px_rgba(240,90,40,0.35)]">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold">Finish all steps to launch!</p>
                                <p className="text-orange-100 text-sm">
                                    You are almost there, just {tasks.length - completedTasks} more to go.
                                </p>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50/50 text-center border-t border-gray-100">
                <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em]">
                    Dismiss Setup Guide
                </button>
            </div>
        </div>
    );
};

export default OnboardingCard;
