import React, { useState } from "react";

const Run = ({ code, language }) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Backend URL
    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const compileAndRun = async () => {
        if (!code) {
            setOutput("Please enter some code first.");
            return;
        }

        setIsLoading(true);
        setOutput("");

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/execute`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: code,
                        language: language,
                        stdin: input,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message || "Code execution failed."
                );
            }

            setOutput(result?.output || "No output");
        } catch (error) {
            console.error("Code execution error:", error);
            setOutput(`Error: ${error?.message || "Failed to execute code"}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden">

            <div className="flex-1 flex flex-col p-2 overflow-y-auto custom-scrollbar">

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                        Input
                    </label>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-full bg-[#393E46] text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#bbb8ff] resize-none"
                        placeholder="Enter input here..."
                    />
                </div>

                <div className="flex-1 mt-10 mb-10">
                    <label className="block text-sm font-medium mb-2">
                        Output
                    </label>

                    <div className="w-full h-full min-h-[100px] bg-[#393E46] text-white rounded px-3 py-2 overflow-y-auto whitespace-pre-wrap font-mono">
                        {output || "Output will appear here..."}
                    </div>
                </div>

                <button
                    className={`w-full bg-[#bbb8ff] text-black hover:bg-[#aaaaff] py-2.5 rounded transition-colors font-medium mt-2 ${
                        isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    onClick={compileAndRun}
                    disabled={isLoading}
                >
                    {isLoading ? "Running..." : "Run Code"}
                </button>

            </div>
        </div>
    );
};

export default Run;