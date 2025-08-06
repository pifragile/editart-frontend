import React, { useEffect, useState } from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";
import { queryStringFromValues } from "../lib/utils";
import { ENV } from "../consts";

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
        alert("Url copied to clipboard.");
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
                                max="0.999"
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
                                        newValues[i] = Number.parseFloat(
                                            e.target.value
                                        ).toFixed(3);
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
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        <RandomizeButton handleRandomize={handleRandomize} />
                        {showButton && (
                            <MintButton
                                price={price}
                                onClick={handleMint}
                                isLoading={isLoading}
                            />
                        )}
                        <button
                            className="btn btn-default btn-form"
                            name="copyUrl"
                            id="copyUrl"
                            onClick={copyUrlToClipBoard}
                        >
                            Share
                        </button>
                        {showGrid && (
                            <a
                                href={`https://grid.editart.xyz${
                                    window.location.pathname
                                }/grid?net=${
                                    ENV === "prod" ? "mainnet" : "testnet"
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-form"
                                style={{ textDecoration: "none" }}
                            >
                                <button
                                    className="btn btn-default btn-form"
                                    name="exploreGrid"
                                    id="exploreGrid"
                                    type="button"
                                    style={{ width: "100%" }}
                                >
                                    Grid
                                </button>
                            </a>
                        )}
                    </div>
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </fieldset>
            </form>
        </div>
    );
}

export default MintForm;
