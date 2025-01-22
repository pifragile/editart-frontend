import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { useState } from "react";
import { queryStringFromValues } from "../lib/utils";

function IFrameView({ testDirKey, params, idx }) {
    const [error, setError] = useState(false);
    const url = `https://editart.fra1.cdn.digitaloceanspaces.com/project_tests/${testDirKey}/index.html${params}&cacheBust=${Date.now()}-${idx}`;
    const handleIframeLoad = async () => {
        const iframe = document.getElementById(`validationTokenFrame${idx}`);
        if (iframe && iframe.contentWindow) {
            let numChanges = Math.ceil(Math.random() * 5)
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
        "?m0=0.5&m1=0.5&m2=0.5&m3=0.5&m4=0.5",
        "?m0=0&m1=0&m2=0&m3=0&m4=0",
        "?m0=1&m1=1&m2=1&m3=1&m4=1",
        "?m0=0.515&m1=0.13&m2=0.76&m3=0.428&m4=0.5",
        "?m0=0.269&m1=0.837&m2=0.543&m3=0.215&m4=0.818",
        "?m0=0.089&m1=0.192&m2=0.146&m3=0.182&m4=0.281",
        "?m0=0.583&m1=0.058&m2=0.935&m3=0.218&m4=0.108",
        "?m0=0.144&m1=0.697&m2=0.45&m3=0.171&m4=0.881",
        "?m0=0.488&m1=0.544&m2=0.177&m3=0.902&m4=0.736",
        "?m0=0.1&m1=0.2&m2=0.3&m3=0.4&m4=0.5",
        "?m0=0.5&m1=0.6&m2=0.7&m3=0.8&m4=0.9",
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
                    {Array.from({ length: 8 }).map((_, idx) => (
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
