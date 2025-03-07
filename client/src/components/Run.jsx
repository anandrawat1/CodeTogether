import React, { useState } from "react";

const Run = ({ code, language }) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const API_KEY = "80ee849ef0mshfc84d34bfee3069p16f169jsnd6848de369cc";
    const API_HOST = "judge0-ce.p.rapidapi.com";
    const API_URL = `https://${API_HOST}`;

    const languageIds = {
        javascript: 63,
        python: 71,
        java: 62,
        cpp: 54,
    };

    const headers = {
        "content-type": "application/json",
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
    };

    const compileAndRun = async () => {
        if (!code) return setOutput("Please enter some code first.");

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/submissions`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    language_id: languageIds[language],
                    source_code: code,
                    stdin: input,
                }),
            });

            const { token } = await res.json();
            if (!token) throw new Error("Failed to receive submission token.");

            let attempts = 0, result;
            while (attempts < 10) {
                await new Promise((r) => setTimeout(r, 2000));
                result = await fetch(`${API_URL}/submissions/${token}`, { headers }).then((r) => r.json());
                if (result.status?.id > 2) break;
                attempts++;
            }

            setOutput(result.compile_output || result.stderr || result.stdout || "No output");
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-800 text-white w-96 overflow-hidden">
            <div className="p-2 flex-shrink-0">
                <h2 className="text-xl mb-0 font-semibold text-center">Run Code</h2>
            </div>

            <div className="flex-1 flex flex-col p-2 overflow-y-auto custom-scrollbar">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Input</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Enter input here..."
                    />
                </div>
                

                <div className="flex-1 mt-10 mb-10">
                    <label className="block text-sm font-medium mb-2">Output</label>
                    <div className="w-full h-full min-h-[100px] bg-gray-700 text-white rounded px-3 py-2 overflow-y-auto whitespace-pre-wrap font-mono">
                        {output || "Output will appear here..."}
                    </div>
                </div>
<button
                    className={`w-full bg-blue-600 text-white py-2.5 mb-3 rounded hover:bg-blue-700 transition-colors font-medium mt-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
