import React, { useState } from 'react';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';

const OnboardingCard = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Confirm your email', completed: false, description: 'We sent a confirmation link to your email' },
        { id: 2, title: 'Set up your Address', completed: false, description: 'Used for invoices & shipping' },
        { id: 3, title: 'Create a Product', completed: true, description: 'Add your first product' },
        { id: 4, title: 'Connect your store', completed: false, description: 'Connect Shopify / Etsy / WooCommerce' },
        { id: 5, title: 'Add payment method', completed: false, description: 'Enable order processing' },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-16">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Let's get you started</h3>
                    <p className="text-sm text-gray-600">Finish these steps to go live</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                </div>
            </div>

            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <button
                            onClick={() => toggleTask(task.id)}
                            className="flex-shrink-0 transition-colors"
                        >
                            {task.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {task.title}
                            </p>
                            <p className="text-xs text-gray-500">{task.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OnboardingCard;