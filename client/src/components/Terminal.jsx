import React, { useState, useRef, useEffect } from 'react';
import { IoTerminal } from "react-icons/io5";
import { FiDelete } from "react-icons/fi";

const Terminal = () => {
    const [history, setHistory] = useState([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentCommand.trim();
            
            if (command) {
                // Add command to history
                setHistory(prev => [...prev, { type: 'command', content: command }]);
                
                // Simple command processing
                processCommand(command);
                
                // Clear current command
                setCurrentCommand('');
            }
        }
    };

    const processCommand = (command) => {
        // Basic command handling
        switch (command.toLowerCase()) {
            case 'clear':
                setHistory([]);
                break;
            case 'help':
                setHistory(prev => [...prev, {
                    type: 'output',
                    content: 'Available commands: clear, help, echo [text]'
                }]);
                break;
            default:
                if (command.toLowerCase().startsWith('echo ')) {
                    const output = command.slice(5);
                    setHistory(prev => [...prev, {
                        type: 'output',
                        content: output
                    }]);
                } else {
                    setHistory(prev => [...prev, {
                        type: 'error',
                        content: `Command not found: ${command}`
                    }]);
                }
        }
    };

    const clearTerminal = () => {
        setHistory([]);
    };

    return (
        <div className="h-full flex flex-col bg-[#232329] text-white w-96 overflow-hidden border-r border-[#393E46]">
            <div className="p-2 flex-shrink-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <IoTerminal className="text-[#bbb8ff]" size={20} />
                    <p className="text-lg text-[#bbb8ff] mb-0">Terminal</p>
                </div>
                <button
                    onClick={clearTerminal}
                    className="p-1 hover:bg-[#393E46] rounded transition-colors"
                >
                    <FiDelete size={20} />
                </button>
            </div>

            <div 
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-2 font-mono text-sm custom-scrollbar bg-[#1E1E1E]"
            >
                {history.map((entry, index) => (
                    <div 
                        key={index} 
                        className={`mb-1 ${
                            entry.type === 'command' ? 'text-green-400' :
                            entry.type === 'error' ? 'text-red-400' :
                            'text-gray-300'
                        }`}
                    >
                        {entry.type === 'command' && '> '}{entry.content}
                    </div>
                ))}
                <div className="flex items-center">
                    <span className="text-green-400 mr-2">{'>'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyDown={handleCommand}
                        className="flex-1 bg-transparent border-none outline-none text-white"
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
};

export default Terminal; 