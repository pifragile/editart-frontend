import React, { useEffect, useState } from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";
import { queryStringFromValues } from "../lib/utils";

function MintForm({
    onSubmitForm,
    onMint,
    price,
    showButton,
    isLoading,
    values,
    handleRandomize,
    error = null,
    showGrid = false,
}) {
    const [localValues, setLocalValues] = useState(values);

    useEffect(() => {
        setLocalValues(values);
    }, [values]);

    let handleMint = (e) => {
        e.preventDefault();
        onMint();
    };

    let keyUpFun = (e) => {
        if ([37, 39].includes(e.keyCode)) {
            handleChange();
        }
    };

    const copyUrlToClipBoard = (e) => {
        e.preventDefault();
        let href = window.location.href;
        href = href.split("?")[0];
        href = href + "?values=" + btoa(queryStringFromValues(...values));
        navigator.clipboard.writeText(href);
    };

    let handleChange = () => {
        //e.preventDefault();
        onSubmitForm(...localValues);
    };

    return (
        <div>
            <form>
                <fieldset style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "15px",
                            margin: "0",
                            padding: "0",
                        }}
                    >
                        {" "}
                        {isLoading && <small>loading...</small>}
                    </div>
                    <legend>Mint Variables</legend>
                    <div
                        className="form-group"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}
                    >
                        {[0, 1, 2, 3, 4].map((i) => (
                            <input
                                key={i}
                                className="mint-slider"
                                type="range"
                                min="0"
                                max="1"
                                value={localValues[i]}
                                step="0.001"
                                id={`value${i}`}
                                name={`value${i}`}
                                onMouseUp={handleChange}
                                onTouchEnd={handleChange}
                                onKeyUp={keyUpFun}
                                onChange={(e) =>
                                    setLocalValues((prev) => {
                                        const newValues = [...prev];
                                        newValues[i] = e.target.value;
                                        return newValues;
                                    })
                                }
                            />
                        ))}
                    </div>

                    <div
                        className="form-group"
                        style={{
                            flex: "row",
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                    >
                        <RandomizeButton handleRandomize={handleRandomize} />
                        <button
                            className="btn btn-default"
                            name="copyUrl"
                            id="copyUrl"
                            onClick={copyUrlToClipBoard}
                        >
                            Copy
                        </button>
                        {showGrid && (
                            <a
                                href={`${window.location.href.split("?")[0]}/grid`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <button
                                    className="btn btn-default"
                                    name="exploreGrid"
                                    id="exploreGrid"
                                    type="button"
                                >
                                    Explore Grid
                                </button>
                            </a>
                        )}
                        {showButton && (
                            <MintButton
                                price={price}
                                onClick={handleMint}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </fieldset>
            </form>
        </div>
    );
}

export default MintForm;
