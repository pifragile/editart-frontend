import MintForm from "./MintForm";

import { useState, useEffect, useContext } from "react";
import { mint, WalletContext } from "../lib/wallet";
import { useSearchParams } from "react-router-dom";
import LiveViewIFrame from "./LiveViewIFrame";
import { queryStringFromValues, valuesFromQueryString } from "../lib/utils";
import UserDetail from "./UserDetail";
import SeriesPrice from "./SeriesPrice";

function Editor({ contract, baseUrl, price, showButton, seriesData }) {
    const wallet = useContext(WalletContext);
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(1);
    const [templateVersion, setTemplateVersion] = useState(0);
    const [error, setError] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const passedValues = searchParams.get("values");
    const initialQueryString = passedValues
        ? atob(passedValues)
        : queryStringFromValues(0.5, 0.5, 0.5, 0.5, 0.5);

    const [history, setHistory] = useState([
        valuesFromQueryString(initialQueryString),
    ]);

    let handleRandomize = (e) => {
        e.preventDefault();
        const newM0 = Math.random().toFixed(3);
        const newM1 = Math.random().toFixed(3);
        const newM2 = Math.random().toFixed(3);
        const newM3 = Math.random().toFixed(3);
        const newM4 = Math.random().toFixed(3);

        onMintFormSubmit(newM0, newM1, newM2, newM3, newM4);
    };

    const [historyIndex, setHistoryIndex] = useState(0);
    baseUrl = baseUrl ? baseUrl + "?" + initialQueryString : "";

    useEffect(() => {
        const handler = (e) => {
            if (e.data.hasOwnProperty("editArtTemplateVersion")) {
                setTemplateVersion(e.data.editArtTemplateVersion);
            }

            if (e.data === "editArtSketchLoaded") {
                setIsLoading(isLoading - 1);
            }
        };
        window.addEventListener("message", handler);
        // Don't forget to remove addEventListener
        return () => window.removeEventListener("message", handler);
    }, [isLoading]);

    const onMintFormSubmit = (m0, m1, m2, m3, m4) => {
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory = newHistory.slice(-100); // history max length is 100
        newHistory.push([m0, m1, m2, m3, m4]);
        setHistory(newHistory);
        setHistoryIndex(Math.min(historyIndex + 1, newHistory.length - 1));
        setSrc(m0, m1, m2, m3, m4);
    };

    const setSrc = (m0, m1, m2, m3, m4) => {
        let qs = queryStringFromValues(m0, m1, m2, m3, m4);
        setIsLoading(isLoading + 1);
        document
            .getElementById("tokenFrame")
            .contentWindow.postMessage({ editartQueryString: qs }, "*");
    };

    let handleMint = async () => {
        setError(null);
        try {
            await mint(
                wallet,
                contract,
                queryStringFromValues(...history[historyIndex]),
                price
            );
        } catch (e) {
            if (e.message.includes("DUPLICATE_MINT")) {
                setError("Duplicate mint not allowed.");
            }
        }
    };

    function handleBack() {
        const newHistoryIndex = Math.max(historyIndex - 1, 0);
        setHistoryIndex(newHistoryIndex);
        setSrc(...history[newHistoryIndex]);
    }

    function handleForward() {
        const newHistoryIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(newHistoryIndex);
        setSrc(...history[newHistoryIndex]);
    }

    function keyPress(e) {
        if (e.keyCode === 90 && e.ctrlKey && e.shiftKey) handleForward();
        else if (e.keyCode === 90 && e.metaKey && e.shiftKey) handleForward();
        else if (e.keyCode === 90 && e.ctrlKey) handleBack();
        else if (e.keyCode === 90 && e.metaKey) handleBack();
    }

    useEffect(() => {
        window.addEventListener("keydown", keyPress);
        return () => {
            window.removeEventListener("keydown", keyPress);
        };
    }, [historyIndex, history, keyPress]);

    return (
        <div>
            <div className="editor-container">
                <div className="editor-iframe-container">
                    <LiveViewIFrame url={baseUrl} />
                </div>
                {width < 1137 && (
                    <div
                        style={{
                            display: "flex",
                            width: "95%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            onClick={handleRandomize}
                            style={{ cursor: "pointer", marginBottom: "15px" }}
                        >
                            <small> &#8635; randomize</small>
                        </div>
                        <div
                            onClick={handleMint}
                            style={{ cursor: "pointer", marginBottom: "15px" }}
                        >
                            <small>&#10003; mint</small>
                        </div>
                    </div>
                )}

                <div className="editor-mint-form-container">
                    <table style={{ padding: "0px", margin: "0px" }}>
                        <tr className="no-border">
                            <td className="no-border">
                                <b>{seriesData.metadata.name}</b>
                            </td>
                            <td className="no-border">
                                by{" "}
                                <UserDetail
                                    address={seriesData.artist}
                                    isLink={true}
                                />
                            </td>
                            {/* <td className="no-border"></td> */}
                        </tr>
                        <tr className="no-border">
                            <td className="no-border">
                                {" "}
                                <SeriesPrice
                                    soldOut={seriesData.soldOut}
                                    price={seriesData.price}
                                    floorPrice={seriesData.floorPrice}
                                />
                            </td>
                            <td className="no-border">
                                {seriesData.numTokensMinted} /{" "}
                                {seriesData.numTokens}
                            </td>
                            {/* <td className="no-border">
                                {seriesData.releaseDate}
                            </td> */}
                        </tr>
                    </table>
                    <br />
                    <br />
                    <MintForm
                        onSubmitForm={onMintFormSubmit}
                        onMint={
                            contract
                                ? handleMint
                                : () => {
                                      console.log("MINT");
                                  }
                        }
                        price={price}
                        showButton={showButton}
                        // isLoading={templateVersion > 0 ? isLoading > 0 : false}
                        isLoading={false}
                        values={history[historyIndex]}
                        handleRandomize={handleRandomize}
                        error={error}
                        showGrid={seriesData.showGrid}
                    />
                </div>
            </div>
            <div style={{ marginTop: "3vh", whiteSpace: "pre-wrap" }}>
                {seriesData.releaseDate}
                <br />
                <br />
                {seriesData.metadata.description}
            </div>
        </div>
    );
}

export default Editor;
