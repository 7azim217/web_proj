import React from 'react';
import { FolderIcon, UsersIcon, ClipboardListIcon, CheckCircleIcon } from 'lucide-react';
import Card from '../ui/Card';
import { Dashboard } from '../../types';

interface DashboardStatsProps {
  stats: Dashboard;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Number of Projects',
      value: stats.projectCount,
      icon: <FolderIcon size={24} className="text-teal-500" />,
      bgColor: 'bg-teal-900/20',
    },
    {
      title: 'Number of Students',
      value: stats.studentCount,
      icon: <UsersIcon size={24} className="text-blue-500" />,
      bgColor: 'bg-blue-900/20',
    },
    {
      title: 'Number of Tasks',
      value: stats.taskCount,
      icon: <ClipboardListIcon size={24} className="text-amber-500" />,
      bgColor: 'bg-amber-900/20',
    },
    {
      title: 'Number of Finished Projects',
      value: stats.finishedProjectCount,
      icon: <CheckCircleIcon size={24} className="text-green-500" />,
      bgColor: 'bg-green-900/20',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card
          key={index}
          variant="bordered"
          className="transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
        >
          <div className={`flex flex-col items-center justify-center p-6 ${item.bgColor} h-full`}>
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">{item.title}</h3>
            <p className="text-3xl font-bold text-white">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;