import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { useState } from "react";
import { queryStringFromValues } from "../lib/utils";
import { APP_URL } from "../consts";

function IFrameView({ testDirKey, params, idx }) {
    const [error, setError] = useState(false);
    let url = `https://editart.fra1.cdn.digitaloceanspaces.com/project_tests/${testDirKey}/index.html?m0=0.500&m1=0.500&m2=0.500&m3=0.500&m4=0.500&cacheBust=${Date.now()}-${idx}`;
    if (idx === 0)
        url = `https://editart.fra1.cdn.digitaloceanspaces.com/project_tests/${testDirKey}/index.html${params}&cacheBust=${Date.now()}-${idx}`;
    const handleIframeLoad = async () => {
        if (idx === 0) return;
        const iframe = document.getElementById(`validationTokenFrame${idx}`);
        if (iframe && iframe.contentWindow) {
            let numChanges = Math.ceil(Math.random() * 5);
            for (let i = 0; i < numChanges; i++) {
                const r = () => Math.random().toFixed(3);
                let qs = queryStringFromValues(r(), r(), r(), r(), r());
                iframe.contentWindow.postMessage(
                    { editartQueryString: qs },
                    "*"
                );
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
            iframe.contentWindow.postMessage(
                { editartQueryString: params.split("?")[1] },
                "*"
            );
        }
    };

    return (
        <iframe
            title="token"
            id={`validationTokenFrame${idx}`}
            className="standard-width standard-height"
            sandbox="allow-scripts allow-same-origin"
            src={error ? `${url}&retry=${Date.now()}` : url}
            onError={() => setError(true)}
            onLoad={handleIframeLoad}
            style={{
                border: "None",
                margin: "0px 5px 0px 0px",
                padding: "0px",
            }}
        />
    );
}

function SeriesValidation() {
    let { key } = useParams();

    const paramsList = [
        "?m0=0.500&m1=0.500&m2=0.500&m3=0.500&m4=0.500",
        "?m0=0.000&m1=0.000&m2=0.000&m3=0.000&m4=0.000",
        "?m0=0.999&m1=0.999&m2=0.999&m3=0.999&m4=0.999",
        "?m0=0.515&m1=0.130&m2=0.760&m3=0.428&m4=0.500",
        "?m0=0.269&m1=0.837&m2=0.543&m3=0.215&m4=0.818",
        "?m0=0.089&m1=0.192&m2=0.146&m3=0.182&m4=0.281",
        "?m0=0.583&m1=0.058&m2=0.935&m3=0.218&m4=0.108",
        "?m0=0.144&m1=0.697&m2=0.450&m3=0.171&m4=0.881",
        "?m0=0.488&m1=0.544&m2=0.177&m3=0.902&m4=0.736",
        "?m0=0.100&m1=0.200&m2=0.300&m3=0.400&m4=0.500",
        "?m0=0.500&m1=0.600&m2=0.700&m3=0.800&m4=0.900",
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < paramsList.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const currentParam = paramsList[currentIndex];

    return (
        <Layout>
            <div className="main">
                <div className="controls">
                    <h1>Series Validation</h1>
                    <p>
                        This tool simulates slider movements in your sketch, all
                        ending up in the same configuration.
                    </p>
                    <p>
                        Step through the different configurations and make sure
                        that all the outputs end up looking identical for each
                        config.
                    </p>
                    <p>
                        You can find help in the{" "}
                        <a
                            href={`${APP_URL}artist-docs#troubleshooting`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            troubleshooting section
                        </a>
                        .
                    </p>
                    <button
                        className="btn btn-default"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        Prev
                    </button>
                    <span style={{ margin: "0 10px 0 10px" }}>
                        {currentIndex + 1}/{paramsList.length}
                    </span>
                    <button
                        className="btn btn-default"
                        onClick={handleNext}
                        disabled={currentIndex === paramsList.length - 1}
                    >
                        Next
                    </button>
                </div>
                <h1>{paramsList[currentIndex]}</h1>
                <div className="flex">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <IFrameView
                            testDirKey={key}
                            key={idx}
                            idx={idx}
                            params={currentParam}
                        />
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default SeriesValidation;
