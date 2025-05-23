import React, { useRef } from 'react';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

interface FileSubmitProps {
  itemId: string;
  type: 'project' | 'task';
}

const FileSubmitButton: React.FC<FileSubmitProps> = ({ itemId, type }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  const handleSubmit = async () => {
    if (!fileRef.current?.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', fileRef.current.files[0]);

    const res = await fetch(`http://localhost:5000/api/submissions/${type}/${itemId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (res.ok) {
      alert('File submitted successfully!');
    } else {
      alert('Submission failed');
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        ref={fileRef}
        className="block text-sm text-gray-300 mb-2"
      />
      <Button variant="primary" size="sm" onClick={handleSubmit}>
        Submit File
      </Button>
    </div>
  );
};

export default FileSubmitButton;
