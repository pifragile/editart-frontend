import MintForm from "./MintForm";

import { useState, useEffect, useContext } from "react";
import { mint, WalletContext } from "../lib/wallet";
import { useSearchParams } from "react-router-dom";

function Editor({ contract, baseUrl, price, showButton }) {
    const wallet = useContext(WalletContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(1);
    const [templateVersion, setTemplateVersion] = useState(0);

    const passedValues = searchParams.get("values");
    const initialQueryString = passedValues
        ? atob(passedValues)
        : "m0=0.5&m1=0.5&m2=0.5&m3=0.5&m4=0.5";

    baseUrl = baseUrl + "?" + initialQueryString;
    const [queryString, setQueryString] = useState(initialQueryString);

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

    const setSrc = (m0, m1, m2, m3, m4) => {
        let qs = `m0=${m0}&m1=${m1}&m2=${m2}&m3=${m3}&m4=${m4}`;
        setQueryString(qs);
        setIsLoading(isLoading + 1);
        document
            .getElementById("tokenFrame")
            .contentWindow.postMessage({ editartQueryString: qs }, "*");
    };

    let handleMint = async () => {
        await mint(wallet, contract, queryString, price);
    };

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
                <iframe
                    id="tokenFrame"
                    title="token"
                    className="token-detail-width token-detail-height"
                    style={{
                        border: "None",
                        marginRight: "2vw",
                    }}
                    src={baseUrl}
                ></iframe>

                <div
                    style={{
                        marginRight: "2vw",
                    }}
                    className="token-detail-width"
                >
                    <MintForm
                        onSubmitForm={setSrc}
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
                        queryString={queryString}
                    />
                </div>
            </div>
        </div>
    );
}

export default Editor;
