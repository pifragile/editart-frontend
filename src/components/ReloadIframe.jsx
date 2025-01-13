import { useState, useEffect, useRef } from "react";
import { addUrlParam } from "../lib/utils";

// function ReloadIframe({ url, idx }) {
//     const [error, setError] = useState(false);
//     url = addUrlParam(url, 'cacheBust', `${Date.now()}-${idx}`);

//     return (
//         <iframe
//             title="token"
//             id={`reloadIframe${idx}`}
//             className="standard-width standard-height"
//             sandbox="allow-scripts allow-same-origin"
//             src={error ? `${url}&retry=${Date.now()}` : url}
//             onError={() => setError(true)}
//             style={{
//                 border: "None",
//                 margin: "0px 5px 0px 0px",
//                 padding: "0px",
//             }}
//         />
//     );
// }

// export default ReloadIframe;

function ReloadIframe({ url, idx }) {
    const [reloadKey, setReloadKey] = useState(0); // Force reload with key change
    const [isVisible, setIsVisible] = useState(false); // Track visibility of the iframe
    const [isLoaded, setIsLoaded] = useState(false); // Track if the iframe has loaded successfully
    const iframeRef = useRef(null); // Reference to the iframe element

    // Add cache-busting query parameters to the URL
    const generateIframeUrl = () => {
        const cacheBustedUrl = addUrlParam(url, 'cacheBust', `${Date.now()}-${idx}`);
        return `${cacheBustedUrl}&retry=${reloadKey}`;
    };

    // Use IntersectionObserver to detect when the iframe is in the viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoaded) {
                    setIsVisible(true);
                }
            },
            { root: null, threshold: 0.1 } // Adjust threshold as needed
        );

        if (iframeRef.current) {
            observer.observe(iframeRef.current);
        }

        return () => {
            if (iframeRef.current) {
                observer.unobserve(iframeRef.current);
            }
        };
    }, [isLoaded]);

    // Retry logic if the iframe fails to load
    useEffect(() => {
        let retryTimeout;

        const iframe = iframeRef.current;
        if (iframe && isVisible) {
            const handleLoad = () => {
                setIsLoaded(true); // Mark as loaded on success
                iframe.setAttribute('data-loaded', 'true');
            };

            const handleError = () => {
                retryTimeout = setTimeout(() => {
                    setReloadKey(prev => prev + 1); // Increment reload key to retry
                }, 2000); // Retry after 2 seconds
            };

            iframe.addEventListener('load', handleLoad);
            iframe.addEventListener('error', handleError);

            return () => {
                iframe.removeEventListener('load', handleLoad);
                iframe.removeEventListener('error', handleError);
                clearTimeout(retryTimeout);
            };
        }
    }, [reloadKey, isVisible]);

    return (
        <iframe
            key={reloadKey} // Force re-render with key change
            ref={iframeRef}
            title={`token-${idx}`}
            id={`reloadIframe${idx}`}
            className="standard-width standard-height"
            sandbox="allow-scripts allow-same-origin"
            src={isVisible && !isLoaded ? generateIframeUrl() : isLoaded ? generateIframeUrl() : ''} // Set src only once
            style={{
                border: "none",
                margin: "0px 5px 0px 0px",
                padding: "0px",
            }}
        />
    );
}

export default ReloadIframe;
