import React, { useState } from "react";

const FileExplorer = ({
    files,
    activeFileId,
    onFileSelect,
    onCreateFile,
    onCreateFolder,
    onDeleteFile,
    onRenameFile,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState({});

    const handleCreateFile = (parentId = null) => {
        const name = prompt("Enter file name:");

        if (!name || !name.trim()) {
            return;
        }

        onCreateFile(name.trim(), parentId);
        setShowMenu(false);
    };

    const handleCreateFolder = (parentId = null) => {
        const name = prompt("Enter folder name:");

        if (!name || !name.trim()) {
            return;
        }

        onCreateFolder(name.trim(), parentId);
        setShowMenu(false);
    };

    const handleRename = (file) => {
        const newName = prompt(
            "Enter new name:",
            file.name
        );

        if (!newName || !newName.trim()) {
            return;
        }

        onRenameFile(
            file.id,
            newName.trim()
        );
    };

    const handleDelete = (file) => {
        const confirmed = window.confirm(
            `Delete "${file.name}"?`
        );

        if (!confirmed) {
            return;
        }

        onDeleteFile(file.id);
    };

    const toggleFolder = (folderId) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const getChildren = (parentId) => {
        return files.filter(
            (file) =>
                file.parentId === parentId
        );
    };

    const renderTree = (parentId = null, level = 0) => {
        const children = getChildren(parentId);

        return children.map((file) => {
            const isFolder = file.type === "folder";
            const isActive =
                file.id === activeFileId;

            const isExpanded =
                expandedFolders[file.id];

            return (
                <div key={file.id}>

                    {/* FILE / FOLDER ROW */}

                    <div
                        className={`group flex items-center h-7 rounded cursor-pointer ${
                            isActive
                                ? "bg-[#37373d] text-white"
                                : "hover:bg-[#2a2d2e]"
                        }`}
                        style={{
                            paddingLeft:
                                `${level * 16 + 6}px`,
                        }}
                    >

                        {/* ARROW */}

                        {isFolder ? (
                            <button
                                onClick={() =>
                                    toggleFolder(file.id)
                                }
                                className="w-5 text-xs text-gray-400 hover:text-white"
                            >
                                {isExpanded
                                    ? "▼"
                                    : "▶"}
                            </button>
                        ) : (
                            <span className="w-5" />
                        )}

                        {/* ICON + NAME */}

                        <div
                            onClick={() => {
                                if (isFolder) {
                                    toggleFolder(file.id);
                                } else {
                                    onFileSelect(file.id);
                                }
                            }}
                            className="flex items-center gap-2 flex-1 min-w-0"
                        >

                            <span className="text-sm">
                                {isFolder
                                    ? isExpanded
                                        ? "📂"
                                        : "📁"
                                    : "📄"}
                            </span>

                            <span className="text-sm truncate">
                                {file.name}
                            </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="hidden group-hover:flex items-center gap-1 mr-1">

                            {isFolder && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateFile(
                                                file.id
                                            );
                                        }}
                                        className="text-xs hover:text-white px-1"
                                        title="New File"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCreateFolder(
                                                file.id
                                            );
                                        }}
                                        className="text-xs hover:text-white px-1"
                                        title="New Folder"
                                    >
                                        📁
                                    </button>
                                </>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRename(file);
                                }}
                                className="text-xs hover:text-white"
                                title="Rename"
                            >
                                ✏️
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(file);
                                }}
                                className="text-xs hover:text-red-400"
                                title="Delete"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                    {/* CHILDREN */}

                    {isFolder && isExpanded && (
                        <div>
                            {renderTree(
                                file.id,
                                level + 1
                            )}
                        </div>
                    )}

                </div>
            );
        });
    };

    return (
        <div className="w-64 h-full bg-[#181818] text-gray-300 border-r border-[#2b2b2b] flex flex-col">

            {/* HEADER */}

            <div className="h-10 px-3 flex items-center justify-between border-b border-[#2b2b2b]">

                <span className="text-xs font-semibold tracking-wide">
                    EXPLORER
                </span>

                <button
                    onClick={() =>
                        setShowMenu(!showMenu)
                    }
                    className="text-lg hover:text-white px-2"
                    title="New"
                >
                    +
                </button>

            </div>

            {/* NEW MENU */}

            {showMenu && (
                <div className="bg-[#252526] border-b border-[#333] p-2">

                    <button
                        onClick={() =>
                            handleCreateFile(null)
                        }
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#333]"
                    >
                        📄 New File
                    </button>

                    <button
                        onClick={() =>
                            handleCreateFolder(null)
                        }
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#333]"
                    >
                        📁 New Folder
                    </button>

                </div>
            )}

            {/* TREE */}

            <div className="flex-1 overflow-y-auto py-2">

                {files.length === 0 && (
                    <div className="text-xs text-gray-500 p-3">
                        No files
                    </div>
                )}

                {renderTree()}

            </div>

        </div>
    );
};

export default FileExplorer;