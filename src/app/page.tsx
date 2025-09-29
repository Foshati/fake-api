"use client";

import { useState } from "react";

export default function Home() {
  const [keyName, setKeyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testResponse, setTestResponse] = useState("");

  const generateKey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName || undefined }),
      });
      const result = await response.json();
      if (result.success) {
        setGeneratedKey(result.data.apiKey);
        setApiKey(result.data.apiKey);
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to generate API key");
    } finally {
      setIsLoading(false);
    }
  };

  const testApi = async (endpoint: string) => {
    if (!apiKey) return;

    try {
      const response = await fetch(`/api/test-api/${endpoint}`, {
        headers: { "x-api-key": apiKey },
      });

      const result = await response.json();
      setTestResponse(JSON.stringify(result, null, 2));
    } catch {
      setTestResponse("Failed to test API");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Free Fake API Service
          </h1>
          <p className="text-gray-600">
            Generate API keys and test fake user endpoints for prototyping
          </p>
        </div>

        {/* Generate API Key Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate API Key</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Key name (optional)"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={generateKey}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Key"}
            </button>
          </div>

          {generatedKey && (
            <div className="bg-green-50 p-3 rounded border">
              <p className="text-sm text-green-800 mb-2">
                Your API Key (Unlimited requests):
              </p>
              <code className="text-green-700 break-all">{generatedKey}</code>
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test with API Key</h2>

          <input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
        </div>

        {/* Test Endpoints */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Endpoints</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => testApi("users")}
              disabled={!apiKey}
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Get All Users
            </button>
            <button
              type="button"
              onClick={() => testApi("user?id=1")}
              disabled={!apiKey}
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Get Single User
            </button>
          </div>
          {testResponse && (
            <div className="bg-gray-100 p-3 rounded border">
              <pre className="text-xs overflow-auto max-h-96">
                {testResponse}
              </pre>
            </div>
          )}
        </div>

        {/* API Documentation */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-800">Base URL:</h3>
              <code className="text-blue-600">
                {process.env.NEXT_PUBLIC_BASE_URL}/api/test-api/
              </code>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">Headers:</h3>
              <code className="text-blue-600">
                x-api-key: your_api_key_here
              </code>
            </div>

            <div>
              <h3 className="font-medium text-gray-800">
                Available Endpoints:
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <code>/users</code> - Get list of 50 fake users with detailed
                  information
                </li>
                <li>
                  <code>/user?id=1</code> - Get single user by ID (1-50)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
