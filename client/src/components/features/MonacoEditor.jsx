import React, { useEffect, useRef, useState } from 'react';

import Editor from '@monaco-editor/react';

import { FiDownload, FiChevronDown } from 'react-icons/fi';

import ACTIONS from '../../Actions';

import { useSocket } from '../../context/SocketContext';

const MonacoEditor = ({ roomId, onCodeChange, onLanguageChange }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Keep the latest callback without causing the socket effect
  // to run again and again.
  const onCodeChangeRef = useRef(onCodeChange);

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  const { socketRef, socketReady } = useSocket();

  const languages = [
    { value: 'html', label: 'HTML' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const getMonacoLang = (lang) => {
    switch (lang) {
      case 'html':
        return 'html';

      case 'javascript':
        return 'javascript';

      case 'python':
        return 'python';

      case 'java':
        return 'java';

      case 'cpp':
        return 'cpp';

      default:
        return 'javascript';
    }
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: '.js',
      python: '.py',
      java: '.java',
      cpp: '.cpp',
      html: '.html',
    };

    return extensions[lang] || '.txt';
  };

  const handleDownload = () => {
    const extension = getFileExtension(language);

    const blob = new Blob([code], {
      type: 'text/plain',
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `code${extension}`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  // Load saved code from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${roomId}`);

    if (savedCode !== null) {
      setCode(savedCode);

      onCodeChangeRef.current?.(savedCode);

      if (editorRef.current) {
        const editor = editorRef.current;

        const currentValue = editor.getValue();

        if (currentValue !== savedCode) {
          isRemoteUpdate.current = true;

          const model = editor.getModel();

          if (model) {
            editor.executeEdits('local-storage-update', [
              {
                range: model.getFullModelRange(),
                text: savedCode,
              },
            ]);
          }

          isRemoteUpdate.current = false;
        }
      }
    }
  }, [roomId]);

  // Save code to localStorage
  useEffect(() => {
    localStorage.setItem(`code-${roomId}`, code);
  }, [code, roomId]);

  // Socket listener
  // IMPORTANT: this effect does NOT depend on onCodeChange.
  useEffect(() => {
    if (!socketReady || !socketRef.current) {
      return;
    }

    const socket = socketRef.current;

    const handleCodeChange = ({ code: incomingCode }) => {
      if (incomingCode === null || incomingCode === undefined) {
        return;
      }

      const editor = editorRef.current;

      // If Monaco is not mounted yet,
      // only update React state.
      if (!editor) {
        setCode(incomingCode);

        onCodeChangeRef.current?.(incomingCode);

        return;
      }

      const currentValue = editor.getValue();

      // VERY IMPORTANT:
      // If both values are already identical,
      // don't touch Monaco at all.
      if (currentValue === incomingCode) {
        return;
      }

      // Save cursor and selection.
      const position = editor.getPosition();
      const selections = editor.getSelections();

      isRemoteUpdate.current = true;

      const model = editor.getModel();

      if (model) {
        editor.executeEdits('remote-update', [
          {
            range: model.getFullModelRange(),
            text: incomingCode,
          },
        ]);
      }

      setCode(incomingCode);

      onCodeChangeRef.current?.(incomingCode);

      // Restore cursor/selection after remote update.
      if (selections && selections.length > 0) {
        editor.setSelections(selections);
      } else if (position) {
        editor.setPosition(position);
      }

      isRemoteUpdate.current = false;
    };

    socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

    return () => {
      socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
    };
  }, [socketReady, socketRef]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    const currentValue = editor.getValue();

    setCode(currentValue);

    onCodeChangeRef.current?.(currentValue);

    // Request latest code from server.
    if (socketRef.current && socketReady) {
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        socketId: socketRef.current.id,
        roomId,
      });
    }
  };

  const handleEditorChange = (value) => {
    // Ignore changes generated by remote socket updates.
    if (isRemoteUpdate.current) {
      return;
    }

    const newCode = value || '';

    setCode(newCode);

    onCodeChangeRef.current?.(newCode);

    // Send local changes to other users.
    if (socketRef.current && socketReady) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: newCode,
      });
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;

    setLanguage(newLang);

    onLanguageChange?.(newLang);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] min-w-0">
      <div className="flex items-center justify-between p-2 bg-[#1e1e1e] border-b border-[#333]">
        <div className="relative inline-block">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-[#2d2d2d] text-white rounded px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#EEEEEE] focus:border-transparent hover:bg-[#3d3d3d] transition-colors duration-200 text-sm min-w-[140px]"
          >
            {languages.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
                className="bg-[#2d2d2d] py-2"
              >
                {lang.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
            <FiChevronDown className="h-4 w-4" />
          </div>
        </div>

        <span className="text-[#bbb8ff] text-lg">
          Code Together
        </span>

        <button
          onClick={handleDownload}
          className="bg-[#2d2d2d] text-white rounded px-4 py-2 hover:bg-[#3d3d3d] focus:outline-none focus:ring-1 focus:ring-[#EEEEEE] focus:border-transparent transition-colors duration-200 text-sm flex items-center gap-2"
        >
          <FiDownload className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="flex-1 h-[calc(100vh-6rem)] relative">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={getMonacoLang(language)}
          defaultValue={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 16,

            minimap: {
              enabled: false,
            },

            automaticLayout: true,

            scrollBeyondLastLine: false,

            wordWrap: 'off',

            smoothScrolling: true,

            lineNumbers: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;