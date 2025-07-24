
import { useEffect, useRef, useState } from "react";
import { resolveIpfsGatewaySketches, resolveIpfsSketches } from "../lib/utils";

function LiveViewIFrame({ url }) {
    const iframeRef = useRef(null);
    const [iframeSrc, setIframeSrc] = useState("");

    useEffect(() => {
        function checkDimensions() {
            const iframe = iframeRef.current;
            if (iframe) {
                const { width, height } = iframe.getBoundingClientRect();
                if (width > 0 && height > 0) {
                    setIframeSrc(resolveIpfsSketches(url));
                } else {
                    // Try again on next frame
                    requestAnimationFrame(checkDimensions);
                }
            }
        }
        checkDimensions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    return (
        <iframe
            ref={iframeRef}
            title="token"
            id="tokenFrame"
            style={{
                border: "None",
                width: "100%",
                aspectRatio: "1/1"
            }}
            src={iframeSrc}
        />
    );
}

export default LiveViewIFrame;
