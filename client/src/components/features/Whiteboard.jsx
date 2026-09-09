import React from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

const Whiteboard = ({ roomId }) => {
    const licenseKey = import.meta.env.VITE_TLDRAW_LICENSE_KEY;

    console.log(
        "TLDRAW LICENSE:",
        licenseKey ? "FOUND" : "NOT FOUND"
    );

    if (!roomId) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#101011] text-white">
                Room ID is missing.
            </div>
        );
    }

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
                licenseKey={licenseKey}
                colorScheme="light"
                options={{
                    deepLinks: true,
                }}
            />
        </div>
    );
};

export default Whiteboard;