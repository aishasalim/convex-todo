"use client";

import { TodoForm } from "./components/todoform"; // Make sure the path is correct
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"; // Ensure this is the correct path
import { Id } from "../../convex/_generated/dataModel"; // Ensure this is the correct path

function TodoListItem({id, title, description, completed }:
  { id: Id<"todos">; 
  title: string; 
  description: string; 
  completed: boolean }) {
    const updatedTodo = useMutation(api.functions.updateTodo);
    const deleteTodo = useMutation(api.functions.deleteTodo);

  return (
  <li className="flex items-center justify-between p-3 rounded-lg border">
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={completed}
        onChange={e => updatedTodo({ id, completed: e.target.checked })}
        className="mr-3"
      />
      <div>
        <p className={`font-semibold ${completed ? 'line-through text-gray-500' : ''}`}>
          {title}
        </p>
        <p className={`text-gray-600 ${completed ? 'line-through' : ''}`}>
          {description}
        </p>
      </div>
    </div>
    <button
      className="bg-gray-50 text-red-500 px-2 py-1 rounded-md hover:bg-gray-150 transition-colors duration-200"
      onClick={() => deleteTodo({ id })}>
      Remove
    </button>
  </li>
  );}

export default function Home() {
  // Fetch todos from Convex (useQuery may return undefined initially)
  const todos = useQuery(api.functions.listTodos);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
        <ul className="space-y-3 mb-4">
        {todos?.map(({_id, title, description, completed}, index) => (
          <TodoListItem
            key={index}
            id={_id}
            title={title}
            description={description}
            completed={completed}
          />
        ))}
        </ul>

        <TodoForm />
      </div>
    </div>
  );
}
