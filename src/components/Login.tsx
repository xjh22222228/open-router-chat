import React from "react";

export default function Login() {
  const [apiKey, setApiKey] = React.useState("");
  const [model, setModel] = React.useState("");

  async function handleLogin() {
    if (!apiKey || !model) {
      return;
    }

    localStorage.setItem("API_KEY", apiKey);
    localStorage.setItem("model", model);
    location.reload();
  }

  return (
    <div className="z-1000 w-[100vw] h-[100vh] fixed top-0 left-0 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="border border-gray-300 p-2 mb-4 w-64"
        />
      </div>
      <input
        type="text"
        placeholder="Enter your model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Login
      </button>
    </div>
  );
}
