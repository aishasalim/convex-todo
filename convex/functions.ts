import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./helper";

// Query to list todos
// Query to list todos
export const listTodos = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    // If the user is not signed in, return an empty array
    if (!user) {
      return [];
    }

    // If the user is signed in, return their todos
    return await ctx.db.query("todos")
      .withIndex("by_userId", q => q.eq("userId", user.tokenIdentifier))
      .collect();
  }
});

// Mutation to create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx); 
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false, 
      userId: user.tokenIdentifier,
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
    const user = await requireUser(ctx); 
    const todo = await ctx.db.get(args.id);
    if (todo?.userId !== user.tokenIdentifier) {
      throw new Error("Unauthorized")
    }
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
    const user = await requireUser(ctx); 
    const todo = await ctx.db.get(args.id);
    if (todo?.userId !== user.tokenIdentifier) {
      throw new Error("Unauthorized")
    }
    await ctx.db.delete(args.id); 
  },
});
