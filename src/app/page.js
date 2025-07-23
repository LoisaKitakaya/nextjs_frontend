// Marks this file as a Client Component, enabling React hooks like useState in Next.js App Router
"use client";

import { useState } from "react";

// Fetches recipe data from the FastAPI backend based on user query
// @param {string} query - The user's input query (e.g., "What can I cook with chicken, rice, and broccoli?")
async function getRecipe(query) {
  const backendUrl = "http://127.0.0.1:8000/api/query";

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };

  const response = await fetch(backendUrl, options);

  if (!response.ok) throw new Error("Failed to fetch recipe");

  return response.json();
}

// Main Home component for the Recipe and Meal Planning frontend
export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handles form submission to fetch recipe data
  // @param {Object} e - The form submission event
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await getRecipe(query);

      setResponse(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  // Render the UI with Tailwind CSS styling
  return (
    <>
      <div className="min-h-screen bg-base-200 p-6">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-center mb-6">
          Recipe and Meal Planning
        </h1>
        {/* Form card for user query input */}
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Textarea for entering the recipe query */}
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What can I cook with chicken, rice, and broccoli?"
              />
              {/* Submit button with loading state */}
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Recipe"}
              </button>
            </form>
          </div>
        </div>
        {/* Display recipe response if available */}
        {response && (
          <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto mt-6">
            <div className="card-body">
              {/* Recipe summary */}
              <h2 className="card-title text-xl font-semibold">
                {response.answer}
              </h2>
              {/* Recipe name */}
              <p>
                <strong>Recipe:</strong> {response.details.recipe_name}
              </p>
              {/* List of ingredients */}
              <p>
                <strong>Ingredients:</strong>{" "}
                {response.details.ingredients.join(", ")}
              </p>
              {/* Cooking instructions */}
              <p>
                <strong>Instructions:</strong>{" "}
                {response.details.instructions.join(", ")}
              </p>
              {/* Cooking tips */}
              <p>
                <strong>Tips:</strong> {response.details.tips.join(", ")}
              </p>
              {/* Preparation time */}
              <p>
                <strong>Prep Time:</strong> {response.details.prep_time}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
