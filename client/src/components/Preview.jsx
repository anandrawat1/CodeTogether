<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const Preview = ({ code, language }) => {
    const [html, setHtml] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (language === 'html') {
            setHtml(code);
        }
        else if (language === 'javascript') {
            // For JavaScript, wrap it in HTML
            setHtml(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview</title>
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        ${code}
                    </script>
                </body>
                </html>
            `);
        }
        else{
            setHtml(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Preview</title>
                    
                </head>
                <body>
                    <p>Invalid language selected</p>
                </body>
                </html>
            `);
        }
    }, [code, language]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col bg-[#232329] text-white w-96 overflow-hidden border-r border-[#393E46]">
            <div className="p-2 flex-shrink-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FaEye className="text-[#bbb8ff]" size={20} />
                    <p className="text-lg text-[#bbb8ff] mb-0">Preview</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="p-1 hover:bg-[#393E46] rounded transition-colors"
                >
                    <FiRefreshCw size={20} />
                </button>
            </div>

            <div className="flex-1 bg-white">
                <iframe
                    key={refreshKey}
                    srcDoc={html}
                    title="preview"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
=======
import React, { useState, useEffect } from 'react';

const Preview = ({ code, language }) => {
    const [previewContent, setPreviewContent] = useState('');

    useEffect(() => {
        console.log(language);
        setPreviewContent(
            language === 'html'
                ? code
                : '<div class="text-center p-4 text-gray-500">Preview is only available for HTML code.</div>'
        );
    }, [code, language]);

    return (
        <div className="h-full flex flex-col bg-[#232329] text-white overflow-hidden">
            {/* <div className="p-2">
                <p className="text-lg text-[#bbb8ff] mb-0">Preview</p>
            </div> */}

            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
                <iframe
                    srcDoc={previewContent}
                    title="preview"
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
>>>>>>> backup/backup-restore
                />
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default Preview; 
=======
export default Preview;
>>>>>>> backup/backup-restore
