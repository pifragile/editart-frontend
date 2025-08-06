import React, { useEffect, useState } from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";
import { queryStringFromValues } from "../lib/utils";
import { ENV } from "../consts";

function MintFormMinimal({
    onSubmitForm,
    onMint,
    price,
    showButton,
    isLoading,
    values,
    handleRandomize,
    handleBack,
    handleForward,
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
                <fieldset
                    style={{ position: "relative", paddingBottom: "25px" }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "15px",
                            margin: "0",
                            padding: "0",
                        }}
                    >
                        {isLoading && <small>loading...</small>}
                    </div>
                    <legend>
                        <small>Choose your output</small>
                    </legend>

                    <div
                        className="form-group"
                        style={{
                            flex: "row",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            margin: 0,
                        }}
                    >
                        {showGrid && (
                            <a
                                href={`https://grid.editart.xyz${
                                    window.location.pathname
                                }/grid?net=${
                                    ENV === "prod" ? "mainnet" : "testnet"
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-center"
                                style={{ textDecoration: "none" }}
                            >
                                <button
                                    className="btn btn-default btn-center btn-ghost"
                                    name="exploreGrid"
                                    id="exploreGrid"
                                    type="button"
                                >
                                    Grid View
                                </button>
                            </a>
                        )}
                    </div>
                    <div
                        className="form-group"
                        style={{
                            flex: "row",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            margin: 0,
                            marginBottom: "1px",
                            marginTop: "1px",
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn-default btn-small"
                            aria-label="Arrow Left"
                            onClick={handleBack}
                        >
                            &#8592;
                        </button>
                        <button
                            className="btn btn-default btn-center"
                            name="randomize"
                            id="randomize"
                            onClick={handleRandomize}
                        >
                            &#8635; Randomize
                        </button>
                        <button
                            type="button"
                            className="btn btn-default btn-small"
                            aria-label="Arrow Right"
                            onClick={handleForward}
                        >
                            &#8594;
                        </button>
                    </div>
                    <div
                        className="form-group"
                        style={{
                            flex: "row",
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            margin: 0,
                        }}
                    >
                        {showButton && (
                            <button
                                className="btn btn-default btn-center btn-ghost"
                                name="mint"
                                id="mint"
                                onClick={
                                    isLoading
                                        ? (e) => e.preventDefault()
                                        : handleMint
                                }
                            >
                                {/* {`Mint for ${formatMutez(price)}`} */}
                                {`Mint`}
                            </button>
                        )}
                    </div>
                    {/* SVG in bottom right corner */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-2px",
                            right: "2px",
                            cursor: "pointer",
                        }}
                        onClick={copyUrlToClipBoard}
                    >
                        <svg
                            fill="var(--font-color)"
                            viewBox="0 0 50 50"
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"></path>
                                <path d="M24 7h2v21h-2z"></path>
                                <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"></path>
                            </g>
                        </svg>
                    </div>
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </fieldset>
            </form>
        </div>
    );
}

export default MintFormMinimal;
