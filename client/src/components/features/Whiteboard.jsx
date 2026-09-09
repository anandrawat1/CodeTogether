import React from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

const Whiteboard = ({ roomId }) => {
    // Room ID nahi hai to error screen dikhao
    if (!roomId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#101011] text-white">
                Room ID is missing.
            </div>
        );
    }

    // Unique room ID for tldraw
    const store = useSyncDemo({
        roomId: `codetogether-${roomId}`,
    });

    return (
        <div
            className="w-full h-full"
            style={{
                position: "relative",
                minHeight: "500px",
            }}
        >
            <Tldraw
                store={store}
                colorScheme="light"
                options={{
                    deepLinks: true,
                }}
            />
        </div>
    );
};

export default Whiteboard;