// Marks this file as a Client Component, enabling React hooks like useState in Next.js App Router
"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

// Fetches recipe data from the FastAPI backend based on user query
// @param {string} query - The user's input query (e.g., "What can I cook with chicken, rice, and broccoli?")
async function getRecipe(query) {
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACKEND_URL
      : "http://127.0.0.1:8000/api/query";

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetch(backendUrl, options);

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? toast.error(error.message)
        : toast.error("Network error")
    );
  }
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

      if (data && data.status_code >= 400) {
        console.log(data.status_code);

        toast.error(data.error);
      } else {
        setResponse(data);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? toast.error("Error fetching recipe:", error.message)
          : "An unexpected error occurred"
      );
    }

    setLoading(false);
  };

  // Render the UI with Tailwind CSS styling
  return (
    <>
      <div className="min-h-screen bg-base-200 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Recipe and Meal Planning
        </h1>

        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What can I cook with chicken, rice, and broccoli?"
              />

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-bars loading-md"></span>
                ) : (
                  "Get Recipe"
                )}
              </button>
            </form>
          </div>
        </div>

        {response && response.details && (
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
              <div>
                <strong>Ingredients:</strong>
                <ol className="list-decimal list-inside ml-4">
                  {response.details.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>
              {/* Cooking instructions */}
              <div>
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside ml-4">
                  {response.details.instructions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>
              {/* Cooking tips */}
              <div>
                <strong>Tips:</strong>
                <ol className="list-decimal list-inside ml-4">
                  {response.details.tips.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>
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
