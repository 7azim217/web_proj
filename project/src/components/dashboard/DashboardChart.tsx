import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../ui/Card';
import { Dashboard } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartProps {
  stats: Dashboard;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ stats }) => {
  const chartData = {
    labels: ['Projects', 'Students', 'Tasks', 'Finished Projects'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.projectCount, 
          stats.studentCount, 
          stats.taskCount, 
          stats.finishedProjectCount
        ],
        backgroundColor: [
          'rgba(72, 209, 204, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(16, 185, 129, 0.6)',
        ],
        borderColor: [
          'rgba(72, 209, 204, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      title: {
        display: true,
        text: 'Admin Dashboard Overview',
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };
  
  return (
    <Card variant="bordered" className="mt-8 p-4">
      <div className="h-80 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default DashboardChart;