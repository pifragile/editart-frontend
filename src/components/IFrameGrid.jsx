import React, { useEffect, useRef, useState } from "react";
import { randomValueQueryString } from "../lib/utils";
import { useParams } from "react-router-dom";
import { APP_URL } from "../consts";
import { getContractStorage } from "../lib/api";
import { bytes2Char } from "@taquito/utils";

// let url = "http://localhost:5175/iframe/index.html";
// // url = "http://localhost:5502/";
// // url = "https://editart.fra1.digitaloceanspaces.com/sketches/QmbmHyv4eGQf1iBpaNPS2A8HoDQrDSV1eeQ7aZht4NghjP/index.html"
const batchSize = 8;
const size = 235;

export default function IframeGrid() {
    const { contract } = useParams();
    const [url, setUrl] = useState(null);

    useEffect(() => {
        async function fetchBaseUrl() {
            if (!contract) return;
            const baseUrl = bytes2Char(await getContractStorage(contract, "base_url"));
            const url = `${APP_URL}cdn/sketches/${baseUrl.split("ipfs://")[1]}/index.html`;
            console.log(url)
            setUrl(url)
        }
        fetchBaseUrl();
    }, [contract]);

    console.log(url)
    const containerRef = useRef(null);
    const nextId = useRef(0);

    // Helper to create wrapper div with iframe and overlay
    function createIframeWithOverlay(id) {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";

        const iframe = document.createElement("iframe");
        iframe.src = url + "?" + randomValueQueryString();
        iframe.setAttribute("data-id", id);
        iframe.setAttribute("loading", "eager");

        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.cursor = "pointer";
        overlay.style.background = "rgba(0,0,0,0)";
        overlay.setAttribute("data-id", id);

        overlay.addEventListener("click", (e) => {
            e.preventDefault();
            const message = {
                type: "trigger-save",
                id: iframe.getAttribute("data-id"),
            };
            iframe.contentWindow.postMessage(message, "*");
        });

        wrapper.appendChild(iframe);
        wrapper.appendChild(overlay);

        // iframe.addEventListener("load", () => {
        //     iframe.contentWindow.postMessage(
        //         {
        //             type: "activate-send-preview",
        //         },
        //         "*"
        //     );
        // });

        // Listen for sketch-loaded message for this iframe
        function handleMessage(event) {
            if (event.source === iframe.contentWindow) {
                // if (
                //     event.data &&
                //     event.data.type === "preview-image" &&
                //     event.data.dataUrl
                // ) {
                //     // Remove iframe and overlay
                //     wrapper.innerHTML = "";
                //     // Create image element
                //     const img = document.createElement("img");
                //     img.src = event.data.dataUrl;
                //     img.style.width = `${size}px`;
                //     img.style.height = `${size}px`;
                //     img.style.display = "block";
                //     wrapper.appendChild(img);
                //     // Mark as loaded so batch logic still works
                //     wrapper.setAttribute("data-loaded", "true");
                //     // Clean up message listener
                //     window.removeEventListener("message", handleMessage);
                //     checkAndAddBatch();
                //     return;
                // }
                if (event.data && event.data.type === "sketch-loaded") {
                  try {
                    const canvas = iframe.contentWindow.document.querySelector("canvas");
                    if (canvas) {
                        console.log('yeahhh')
                      const dataUrl = canvas.toDataURL();
                      wrapper.innerHTML = "";
                      const img = document.createElement("img");
                      img.src = dataUrl;
                      img.style.width = `${size}px`;
                      img.style.height = `${size}px`;
                      img.style.display = "block";
                      wrapper.appendChild(img);
                      wrapper.setAttribute("data-loaded", "true");
                      window.removeEventListener("message", handleMessage);
                      checkAndAddBatch();

                    }
                  } catch (err) {
                    // Ignore errors (cross-origin, etc.)
                  }
                  return;
                }
                // if (event.data && event.data.type === "sketch-loaded") {
                //     iframe.contentWindow.postMessage(
                //         {
                //             type: "send-preview",
                //         },
                //         "*"
                //     );
                // }
            }
        }
        window.addEventListener("message", handleMessage);

        // Clean up event listener when iframe is removed
        wrapper.cleanup = () => {
            window.removeEventListener("message", handleMessage);
        };

        return wrapper;
    }

    // Add a batch of iframes to the container
    function addBatch() {
        for (let i = 0; i < batchSize; i++) {
            const wrapper = createIframeWithOverlay(nextId.current++);
            containerRef.current.appendChild(wrapper);
        }
    }

    // Check if all iframes are loaded, then add another batch
    function checkAndAddBatch() {
        const wrappers = Array.from(containerRef.current.children);
        const allLoaded = wrappers.every(
            (wrapper) => wrapper.getAttribute("data-loaded") === "true"
        );
        if (allLoaded) {
            addBatch();
        }
    }

    // Initial mount
    useEffect(() => {
        if(!url) return;
        addBatch();
        return () => {
            // Clean up message listeners
            Array.from(containerRef.current.children).forEach((wrapper) => {
                if (wrapper.cleanup) wrapper.cleanup();
            });
        };
        // eslint-disable-next-line
    }, [url]);

    // CSS styles
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      body {
        margin: 0;
        padding: 1rem;
        font-family: sans-serif;
      }
      .iframe-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .iframe-container iframe {
        width:${size}px;
        height:${size}px;
        border: none;
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);


    return <div className="iframe-container" ref={containerRef}></div>;
}
