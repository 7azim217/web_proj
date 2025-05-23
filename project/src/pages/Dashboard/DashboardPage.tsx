import React, { useEffect } from 'react';
import useDataStore from '../../store/dataStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage: React.FC = () => {
  const { dashboard, fetchDashboardData } = useDataStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const chartData = [
    { label: 'Projects', value: dashboard.projectCount },
    { label: 'Students', value: dashboard.studentCount },
    { label: 'Tasks', value: dashboard.taskCount },
    { label: 'Finished', value: dashboard.finishedCount },
  ];



  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-500">Welcome to the Task Management System</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">Number of Projects</h2>
          <p className="text-xl">{dashboard.projectCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">Number of Students</h2>
          <p className="text-xl">{dashboard.studentCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">Number of Tasks</h2>
          <p className="text-xl">{dashboard.taskCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="font-bold">Number of Finished Projects</h2>
          <p className="text-xl">{dashboard.finishedCount}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-300 mb-3">Admin Dashboard Overview</h3>
      <div className="bg-gray-900 rounded p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
