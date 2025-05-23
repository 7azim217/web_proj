import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS, ADD_PROJECT, DELETE_PROJECT } from '../graphql/projectQueries';

const ProjectsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);
  const [addProject] = useMutation(ADD_PROJECT);
  const [deleteProject] = useMutation(DELETE_PROJECT);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    progress: 0,
    startDate: '',
    endDate: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject({ variables: form });
      refetch();
      setForm({ title: '', description: '', category: '', progress: 0, startDate: '', endDate: '' });
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Progress" value={form.progress} onChange={e => setForm({ ...form, progress: +e.target.value })} />
        <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
        <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
        <button type="submit">Add Project</button>
      </form>

      <ul className="space-y-2">
        {data.projects.map((p: any) => (
          <li key={p.id} className="border p-3 rounded">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <p><strong>Category:</strong> {p.category} | <strong>Progress:</strong> {p.progress}%</p>
            <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
