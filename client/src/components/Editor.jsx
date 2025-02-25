import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
};

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    
    useEffect(() => {
        if (!socketRef.current) return;

        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            // Listen for code changes from other users
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current && code !== editorRef.current.getValue()) {
                    editorRef.current.setValue(code);
                }
            });

            // Handle code changes
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });

            // Request initial code sync
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
                socketId: socketRef.current.id,
                roomId,
                code: editorRef.current.getValue()
            });
        }
        
        init();

        return () => {
            // Cleanup
            socketRef.current?.off(ACTIONS.CODE_CHANGE);
            if (editorRef.current) {
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
        };
    }, [socketRef.current, roomId]);

    return (
        <div className="min-h-[calc(100vh-20px)] text-[20px] leading-[1.6] pt-5">
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
};

export default Editor; 