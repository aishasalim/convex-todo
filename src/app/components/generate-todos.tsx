import { useState } from 'react';
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function Generate() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const generateTodo = useAction(api.actions.generateTodos);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    try {
      const todos = await generateTodo({ prompt });
      console.log(todos);
      setPrompt("");
    } catch (err) {
      console.error("Error generating tasks:", err);
    } finally {
      setLoading(false); // Set loading to false when request finishes
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <input
          type="text"
          id="title"
          name="title"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Generate task with AI"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className={`w-full bg-blue-500 text-white p-2 my-2 rounded-md mt-2 hover:bg-blue-600 transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          type="submit"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            "Generate"
          )}
        </button>
      </div>
    </form>
  );
}
