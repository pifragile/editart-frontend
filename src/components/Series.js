import { useParams } from "react-router-dom";

import Layout from "./Layout";

import { useEffect, useState } from "react";

import { getContractStorage, getContractMetadata } from "../lib/api";
import UserDetail from "./UserDetail";
import MarketPlace from "./Marketplace";
import Mint from "./Mint";
import { extractTokensForOverview } from "../lib/utils";

import TokenOverview from "./TokenOverview";

function Series() {
    let { contract } = useParams();
    const [metadata, setMetadata] = useState(null);
    const [numTokens, setNumTokens] = useState(null);
    const [numTokensMinted, setNumTokensMinted] = useState(null);
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        const fetchStorage = async () => {
            setNumTokens(await getContractStorage(contract, "num_tokens"));
            setNumTokensMinted(
                await getContractStorage(contract, "last_token_id")
            );
            setArtist(await getContractStorage(contract, "artist_address"));
            setMetadata(await getContractMetadata(contract));
        };

        fetchStorage().catch(console.error);
    }, [contract]);

    if (numTokens && metadata) {
        return (
            <Layout>
                <div>
                    <div>
                        <b>{metadata.name}</b>
                    </div>
                    <div>
                        by <UserDetail address={artist} isLink={true} />
                    </div>
                    <div style={{ marginTop: "1vh", whiteSpace: "pre-wrap" }}>
                        {metadata.description}
                    </div>
                    {/* <div>{paused ? "paused" : "not paused"}</div> */}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ margin: "1vh 0 1vh 0" }}>
                        {numTokensMinted} / {numTokens} minted
                    </div>
                </div>

                <Mint contract={contract} />
                <div style={{ marginTop: "5vh" }}>
                    <MarketPlace contract={contract}></MarketPlace>
                </div>

                <div style={{ marginTop: "5vh" }}>
                    <h1>All tokens</h1>
                    <TokenOverview
                        query={`v1/tokens?contract=${contract}`}
                        pageLength={30}
                        extractTokens={extractTokensForOverview}
                    ></TokenOverview>
                </div>
            </Layout>
        );
    } else {
        <Layout>return "Loading..";</Layout>;
    }
}

export default Series;
