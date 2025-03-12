import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

const Whiteboard = () => {
  return (
    // <div className="h-full w-full bg-white">
    //   <Excalidraw
    //     theme="dark"
    //     viewModeEnabled={false}
    //     zenModeEnabled={false}
    //     gridModeEnabled={false}
    //   >
    //   </Excalidraw>

    <div className="h-full flex flex-col bg-[#232329] text-white overflow-hidden border-r border-[#393E46]">
      {/* <div className="p-2">
        <p className="text-lg text-[#bbb8ff] mb-0">Whiteboard</p>
      </div> */}
      <div className="flex-1 bg-white overflow-hidden">
        <Excalidraw
          theme="dark"
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={false}
        />
      </div>
    </div>
  );
};

export default Whiteboard; 