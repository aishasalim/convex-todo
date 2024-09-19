"use client";

import { TodoForm } from "./components/new-todoform";
import { TodoList } from "./components/todolist";
import { Generate } from "./components/generate-todos";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  // Fetch todos from Convex
  const todos = useQuery(api.functions.listTodos);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthLoading>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      </AuthLoading>


      <Authenticated>
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">To-Do List</h1>
            <UserButton />
          </div>
          {todos ? <TodoList /> : <p>No todos available</p>}
          <Generate />
          <TodoForm />
        </div>
      </Authenticated>


      <Unauthenticated>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-4">Please sign in to view and manage your to-do list.</p>
          <SignInButton />
        </div>
      </Unauthenticated>
    </div>
  );
}
