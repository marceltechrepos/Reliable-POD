import React from 'react';
    import { Plus, Eye, Settings, BookOpen, Play, CreditCard } from 'lucide-react';

    const QuickActions = () => {
      const actions = [
        {
          title: 'Create Product',
          description: 'Add new item to catalog',
          icon: Plus,
          color: 'bg-green-500',
          hoverColor: 'hover:bg-green-600'
        },
        {
          title: 'View Orders',
          description: 'Check recent orders',
          icon: Eye,
          color: 'bg-blue-500',
          hoverColor: 'hover:bg-blue-600'
        },
        {
          title: 'Settings',
          description: 'Configure your store',
          icon: Settings,
          color: 'bg-gray-500',
          hoverColor: 'hover:bg-gray-600'
        },
        {
          title: 'Guide',
          description: 'Getting started help',
          icon: BookOpen,
          color: 'bg-purple-500',
          hoverColor: 'hover:bg-purple-600'
        },
        {
          title: 'Video Tutorials',
          description: 'Watch how-to videos',
          icon: Play,
          color: 'bg-red-500',
          hoverColor: 'hover:bg-red-600'
        },
        {
          title: 'Payment Setup',
          description: 'Configure payments',
          icon: CreditCard,
          color: 'bg-yellow-500',
          hoverColor: 'hover:bg-yellow-600'
        }
      ];

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${action.color} ${action.hoverColor} rounded-lg flex items-center justify-center transition-colors group-hover:scale-110 transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    export default QuickActions;