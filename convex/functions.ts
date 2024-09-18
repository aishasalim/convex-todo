import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to list todos
export const listTodos = query(async ({ db }) => {
  return await db.query("todos").collect();
});

// Mutation to create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false, 
    });
  },
});

// Mutation to update the completed status of a todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),     
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});

// Mutation to delete a todo item
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"), 
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id); 
  },
});
