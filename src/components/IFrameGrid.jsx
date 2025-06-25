import React, { useEffect, useState, useRef } from "react";
import { randomValueQueryString } from "../lib/utils";
import { useParams, Link } from "react-router-dom";
import { APP_URL } from "../consts";
import { getContractStorage } from "../lib/api";
import { bytes2Char } from "@taquito/utils";
import "./IFrameGrid.css"; // Import external CSS


export default function IframeGrid() {
    const isMobile = window.innerWidth <= 768;
    const batchSize = isMobile ? 2 : 8;
    const { contract, projecttest } = useParams();
    const [url, setUrl] = useState(null);
    const [elements, setElements] = useState([]);
    const elementsRef = useRef([]); // Ref to store the current state of elements
    useEffect(() => {
        async function fetchBaseUrl() {
            if (!contract && !projecttest) return;
            let url;
            if (projecttest) {
                url = `${APP_URL}cdn/project_tests/${projecttest}/index.html`;
            } else {
                const baseUrl = bytes2Char(
                    await getContractStorage(contract, "base_url")
                );
                url = `${APP_URL}cdn/sketches/${
                    baseUrl.split("ipfs://")[1]
                }/index.html`;
            }
            // url = "http://localhost:5174/iframe/index.html";
            // url =
            //     "https://editart.fra1.cdn.digitaloceanspaces.com/project_tests/1748600479-8e3ad8f5-41d0-4efc-9ee9-23f29e30c152/index.html";
            setUrl(url);
        }
        fetchBaseUrl();
    }, [contract, projecttest]);

    useEffect(() => {
        if (!url) return;

        function addBatch() {
            // Only add a batch if elementsRef.current is empty or all are images
            const isEmpty = elementsRef.current.length === 0;
            const allProcessed =
                isEmpty ||
                elementsRef.current.every((el) => el.type === "image");
            if (allProcessed) {
                const newBatch = Array.from({ length: batchSize }, (_, i) => {
                    const id = elementsRef.current.length + i; // Use ref to get the current length
                    const queryString = randomValueQueryString();
                    return {
                        id,
                        type: "iframe",
                        src: `${url}?${queryString}`,
                        queryString,
                    };
                });
                elementsRef.current = [...elementsRef.current, ...newBatch]; // Update the ref first
                setElements([...elementsRef.current]); // Update the state from the ref
            }
        }

        function handleMessage(event) {
            const iframe = Array.from(document.querySelectorAll("iframe")).find(
                (iframe) => iframe.contentWindow === event.source
            );
            if (!iframe) return;

            const iframeId = Number(iframe.getAttribute("data-id")); // Get the id from the iframe's data-id attribute
            const iframeElement = elementsRef.current.find(
                (el) => el.id === iframeId
            );

            if (!iframeElement) {
                console.error("Iframe element not found in elements array.");
                return;
            }

            if (event.data?.type === "sketch-loaded") {
                try {
                    const canvas =
                        iframe.contentDocument?.querySelector("canvas");
                    if (canvas) {
                        const dataUrl = canvas.toDataURL();
                        elementsRef.current = elementsRef.current.map((el) =>
                            el.id === iframeElement.id
                                ? { ...el, type: "image", src: dataUrl }
                                : el
                        ); // Update the ref
                        setElements([...elementsRef.current]); // Update the state from the ref

                        // Check if all elements are images

                        addBatch();
                    }
                } catch (err) {
                    console.error("Error accessing canvas", err);
                }
            }

            // if (
            //     event.data &&
            //     event.data.type === "preview-image" &&
            //     event.data.dataUrl
            // ) {
            //     elementsRef.current = elementsRef.current.map((el) =>
            //         el.id === iframeElement.id
            //             ? { ...el, type: "image", src: event.data.dataUrl }
            //             : el
            //     ); // Update the ref
            //     setElements([...elementsRef.current]); // Update the state from the ref

            //     // Check if all elements are images

            //     addBatch();
            //     return;
            // }

            // if (event.data && event.data.type === "sketch-loaded") {
            //     iframe.contentWindow.postMessage(
            //         {
            //             type: "send-preview",
            //         },
            //         "*"
            //     );
            // }
        }

        window.addEventListener("message", handleMessage);
        addBatch();

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [url]);

    return (
        <div className="iframe-container">
            {elements.map((el) => (
                <Link
                    key={el.id}
                    to={`/series/${contract}?values=${btoa(el.queryString)}`}
                    target="_blank"
                    style={{ textDecoration: "none", cursor: "pointer" }}
                >
                    {el.type === "iframe" ? (
                        <div className="iframe-wrapper">
                            <iframe
                                src={el.src}
                                data-id={el.id}
                                loading="eager"
                                className="iframe"
                            ></iframe>
                        </div>
                    ) : (
                        <img
                            src={el.src}
                            alt={`Sketch ${el.id}`}
                            className="image"
                        />
                    )}
                </Link>
            ))}
        </div>
    );
}
