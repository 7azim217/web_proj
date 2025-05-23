import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASKS, ADD_TASK, UPDATE_TASK_STATUS } from '../graphql/taskQueries';

const TasksPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK);
  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    projectId: '',
    dueDate: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({ variables: form });
      refetch();
      setForm({ title: '', description: '', assignedTo: '', projectId: '', dueDate: '' });
    } catch (err) {
      console.error('Add task error', err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateStatus({ variables: { id, status } });
    refetch();
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      <form onSubmit={handleAdd} className="space-y-2 mb-6">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="text" placeholder="Assigned To (User ID)" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} required />
        <input type="text" placeholder="Project ID" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required />
        <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        <button type="submit">Add Task</button>
      </form>

      <ul className="space-y-3">
        {data.tasks.map((task: any) => (
          <li key={task.id} className="border p-3 rounded">
            <h4 className="text-lg font-semibold">{task.title}</h4>
            <p>{task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
              className="mt-1"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
