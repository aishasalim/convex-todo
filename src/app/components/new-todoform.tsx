import { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createTodo = useMutation(api.functions.createTodo);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createTodo({ title, description });
    setTitle('');
    setDescription('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <input
          type="text"
          id="title"
          name="title"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          id="description"
          name="description"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600 transition-colors duration-200"
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  );
}
