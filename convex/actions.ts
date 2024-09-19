import { action } from "./_generated/server";
import axios from "axios";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireUser } from "./helper";

// Action to generate to-do tasks using Llama 3.1 via OpenRouter
export const generateTodos = action({
  args: {
    prompt: v.string(), // The prompt for generating to-dos
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const { prompt } = args;

    // Fetch the API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key is not set.");
    }

    // Set up OpenRouter API request to Llama 3.1
    const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Define the request body with the chosen Llama model
    const requestBody = {
      model: "meta-llama/llama-3.1-8b-instruct:free", // Llama 3.1 model
      messages: [
        {
          role: "system",
          content:
            "Generate a list of to-dos based on the given prompt. Generate 3-4 to-dos, if the user didn't specify how many to add. Return the JSON object with the format { todos: [title: string, description: string] }. Only return the JSON, without extra explanation.",
        },
        { role: "user", content: `Prompt: ${prompt}` },
      ],
      max_tokens: 300, // Limit tokens to control the length of the response
    };

    try {
      // Make the request to OpenRouter
      const response = await axios.post(apiUrl, requestBody, { headers });

      // Extract the response content
      const responseContent = response.data.choices[0].message.content;

      // Use a regex to extract the JSON from the response (in case Llama adds extra text)
      const jsonMatch = responseContent.match(/\{.*\}/);

      if (!jsonMatch) {
        throw new Error("Could not find valid JSON in the response.");
      }

      const todosResponse = JSON.parse(jsonMatch[0]) as {
        todos: { title: string; description: string }[];
      };
      await ctx.runMutation(internal.functions.createManyTodos, {
        todos: todosResponse.todos,
        userId: user.tokenIdentifier,
      });
      return todosResponse;

    } catch (error) {
      console.error("Error generating tasks:", error);
      throw new Error("Failed to generate tasks from OpenRouter.");
    }
  },
});
