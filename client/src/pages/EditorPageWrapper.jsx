import React from 'react';
import {SocketProvider} from '../context/SocketContext';
import EditorPage from './EditorPage';

const EditorPageWrapper = () => {
    return (
        <SocketProvider>
            <EditorPage />
        </SocketProvider>
    );
};

export default EditorPageWrapper;
