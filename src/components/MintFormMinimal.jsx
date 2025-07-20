import React, { useEffect, useState } from "react";
import MintButton from "./MintButton";
import RandomizeButton from "./RandomizeButton";
import { queryStringFromValues } from "../lib/utils";

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
                <fieldset style={{ position: "relative", border: "none" }}>
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
                    {/* <legend>Mint Variables</legend> */}

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
                                href={`${
                                    window.location.href.split("?")[0]
                                }/grid`}
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
                    {error && <span style={{ color: "red" }}>{error}</span>}
                </fieldset>
            </form>
        </div>
    );
}

export default MintFormMinimal;
