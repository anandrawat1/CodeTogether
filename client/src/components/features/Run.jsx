import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const Run = ({ code, language }) => {
    const { roomId } = useParams();
    const { socketRef, socketReady } = useSocket();

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Backend URL
    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // Receive Input and Output changes from other users
    useEffect(() => {
        if (!socketReady || !socketRef.current || !roomId) return;

        const socket = socketRef.current;

        const handleRemoteInput = ({ roomId: incomingRoomId, input: incomingInput }) => {
            if (incomingRoomId !== roomId) return;

            setInput(incomingInput ?? "");
        };

        const handleRemoteOutput = ({ roomId: incomingRoomId, output: incomingOutput }) => {
            if (incomingRoomId !== roomId) return;

            setOutput(incomingOutput ?? "");
        };

        socket.on("RUN_INPUT_CHANGE", handleRemoteInput);
        socket.on("RUN_OUTPUT_CHANGE", handleRemoteOutput);

        return () => {
            socket.off("RUN_INPUT_CHANGE", handleRemoteInput);
            socket.off("RUN_OUTPUT_CHANGE", handleRemoteOutput);
        };
    }, [roomId, socketReady, socketRef]);

    // Input change
    const handleInputChange = (e) => {
        const newInput = e.target.value;

        setInput(newInput);

        if (socketReady && socketRef.current && roomId) {
            socketRef.current.emit("RUN_INPUT_CHANGE", {
                roomId,
                input: newInput,
            });
        }
    };

    const compileAndRun = async () => {
        if (!code) {
            setOutput("Please enter some code first.");

            if (socketReady && socketRef.current && roomId) {
                socketRef.current.emit("RUN_OUTPUT_CHANGE", {
                    roomId,
                    output: "Please enter some code first.",
                });
            }

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

            const newOutput = result?.output || "No output";

            setOutput(newOutput);

            // Share output with everyone in the room
            if (socketReady && socketRef.current && roomId) {
                socketRef.current.emit("RUN_OUTPUT_CHANGE", {
                    roomId,
                    output: newOutput,
                });
            }
        } catch (error) {
            console.error("Code execution error:", error);

            const errorOutput = `Error: ${
                error?.message || "Failed to execute code"
            }`;

            setOutput(errorOutput);

            // Share error output with everyone
            if (socketReady && socketRef.current && roomId) {
                socketRef.current.emit("RUN_OUTPUT_CHANGE", {
                    roomId,
                    output: errorOutput,
                });
            }
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
                        onChange={handleInputChange}
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