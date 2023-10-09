import MintForm from "./MintForm";

import { useState, useEffect, useContext } from "react";
import { mint, WalletContext } from "../lib/wallet";
import { useSearchParams } from "react-router-dom";
import LiveViewIFrame from "./LiveViewIFrame";
import { queryStringFromValues, valuesFromQueryString } from "../lib/utils";

function Editor({ contract, baseUrl, price, showButton }) {
    const wallet = useContext(WalletContext);
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(1);
    const [templateVersion, setTemplateVersion] = useState(0);

    const passedValues = searchParams.get("values");
    const initialQueryString = passedValues
        ? atob(passedValues)
        : queryStringFromValues(0.5, 0.5, 0.5, 0.5, 0.5);

    const [history, setHistory] = useState([valuesFromQueryString(initialQueryString)]);
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
        newHistory = newHistory.slice(-100) // history max length is 100
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
        await mint(wallet, contract, queryStringFromValues(...history[historyIndex]), price);
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "left",
                    maxWidth: "100vw",
                    flexWrap: "wrap",
                    marginTop: "2vw",
                    padding: 0,
                }}
            >
                <div
                    className="token-detail-width token-detail-height"
                    style={{
                        border: "None",
                        marginRight: "2vw",
                    }}
                >
                    <LiveViewIFrame url={baseUrl} />
                </div>

                <div
                    style={{
                        marginRight: "2vw",
                    }}
                    className="token-detail-width"
                >
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
                    />
                </div>
            </div>
        </div>
    );
}

export default Editor;
