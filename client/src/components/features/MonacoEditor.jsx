import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ACTIONS from "../../Actions";
import { useSocket } from "../../context/SocketContext";

const MonacoEditor = ({
  roomId,
  activeFile,
  onCodeChange,
  onLanguageChange,
}) => {
  const { socketRef } = useSocket();
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  /*
   * -----------------------------------------
   * Load active file
   * -----------------------------------------
   */

  useEffect(() => {
    if (!activeFile) {
      setCode("");
      setLanguage("javascript");
      return;
    }

    isRemoteUpdate.current = true;

    setCode(activeFile.content || "");
    setLanguage(activeFile.language || "javascript");

    onCodeChange?.(activeFile.content || "");

    onLanguageChange?.(activeFile.language || "javascript");

    setTimeout(() => {
      isRemoteUpdate.current = false;
    }, 0);
  }, [activeFile?.id, activeFile?.content, activeFile?.language]);

  /*
   * -----------------------------------------
   * Editor mount
   * -----------------------------------------
   */
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    const handleRemoteFileChange = ({ fileId, content, language }) => {
      if (!activeFile || fileId !== activeFile.id) {
        return;
      }

      isRemoteUpdate.current = true;

      setCode(content || "");

      if (language) {
        setLanguage(language);
      }

      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 0);
    };

    socket.on(ACTIONS.FILE_CONTENT_CHANGE, handleRemoteFileChange);

    return () => {
      socket.off(ACTIONS.FILE_CONTENT_CHANGE, handleRemoteFileChange);
    };
  }, [activeFile?.id, socketRef]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  /*
   * -----------------------------------------
   * Language change
   * -----------------------------------------
   */

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  /*
   * -----------------------------------------
   * Code change
   * -----------------------------------------
   */

  const handleCodeChange = (value) => {
    const newCode = value || "";

    setCode(newCode);

    if (isRemoteUpdate.current) {
      return;
    }

    onCodeChange?.(newCode);

    if (!activeFile) {
      return;
    }

    

    socketRef.current?.emit(ACTIONS.FILE_CONTENT_CHANGE, {
      roomId,
      fileId: activeFile.id,
      content: newCode,
      language,
    });
  };

  /*
   * -----------------------------------------
   * Download file
   * -----------------------------------------
   */

  const handleDownload = () => {
    if (!activeFile) {
      return;
    }

    const blob = new Blob([code], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = activeFile.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* ---------------------------------
                Editor Header
            --------------------------------- */}

      <div className="h-10 flex items-center justify-between bg-[#252526] border-b border-[#333] px-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">
            {activeFile?.type === "folder" ? "📁" : "📄"}
          </span>

          <span className="text-sm text-gray-300 truncate">
            {activeFile?.name || "No file selected"}
          </span>
        </div>

        {activeFile && (
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1 rounded bg-[#333] hover:bg-[#444] text-gray-300 hover:text-white"
          >
            Download
          </button>
        )}
      </div>

      {/* ---------------------------------
                Language
            --------------------------------- */}

      <div className="h-9 flex items-center justify-between bg-[#1e1e1e] border-b border-[#2b2b2b] px-3">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-[#252526] text-gray-300 text-xs px-2 py-1 rounded outline-none"
        >
          <option value="javascript">JavaScript</option>

          <option value="html">HTML</option>

          <option value="css">CSS</option>

          <option value="python">Python</option>

          <option value="java">Java</option>

          <option value="cpp">C++</option>
        </select>

        <span className="text-xs text-gray-500">{activeFile?.name || ""}</span>
      </div>

      {/* ---------------------------------
                Monaco
            --------------------------------- */}

      <div className="flex-1 min-h-0">
        {activeFile ? (
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onMount={handleEditorDidMount}
            onChange={handleCodeChange}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: true,
              },
              fontSize: 14,
              tabSize: 4,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: {
                top: 10,
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-3">📂</div>

              <p>Select a file from Explorer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonacoEditor;
