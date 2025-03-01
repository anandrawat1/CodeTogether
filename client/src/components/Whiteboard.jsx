import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

const Whiteboard = () => {
  return (
    <div className="h-full w-full bg-white">
      <Excalidraw
        theme="dark"
        viewModeEnabled={false}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
};

export default Whiteboard; 