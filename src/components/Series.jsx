import { useParams } from "react-router-dom";

import Layout from "./Layout";

import { useContext, useEffect, useState } from "react";

import {
    getContractStorage,
    getContractMetadata,
    getFloorPrice,
} from "../lib/api";
import UserDetail from "./UserDetail";
import MarketPlace from "./Marketplace";
import { extractTokensForOverview } from "../lib/utils";

import TokenOverview from "./TokenOverview";
import { bytes2Char } from "@taquito/utils";
import { WalletContext } from "../lib/wallet";
import Editor from "./Editor";
import { SeriesContext } from "../App";
import SeriesPrice from "./SeriesPrice";

function Series() {
    const series = useContext(SeriesContext);

    const { contract } = useParams();
    const releaseDate = new Date(
        series.find((e) => e.contract === contract)?.plannedRelease
    );
    const wallet = useContext(WalletContext);
    const [metadata, setMetadata] = useState(null);
    const [numTokens, setNumTokens] = useState(null);
    const [numTokensMinted, setNumTokensMinted] = useState(null);
    const [artist, setArtist] = useState(null);
    const [price, setPrice] = useState(null);
    const [floorPrice, setFloorPrice] = useState(null);
    const [soldOut, setSoldOut] = useState(false);
    const [baseUrl, setBaseUrl] = useState(null);
    const [paused, setPaused] = useState(null);
    const [activeAccount, setActiveAccount] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);
    const [disableMintOnMobile, setDisableMintOnMobile] = useState(true);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        const fetchStorage = async () => {
            if (contract === null || contract === "null") return;
            const numTokensRes = await getContractStorage(
                contract,
                "num_tokens"
            );
            const numTokensMintedRes = await getContractStorage(
                contract,
                "last_token_id"
            );
            setNumTokens(numTokensRes);
            setPrice(await getContractStorage(contract, "price"));
            setNumTokensMinted(numTokensMintedRes);
            if (numTokensRes === numTokensMintedRes) setSoldOut(true);
            setArtist(await getContractStorage(contract, "artist_address"));
            setMetadata(await getContractMetadata(contract));
            setPaused(await getContractStorage(contract, "paused"));

            setBaseUrl(
                bytes2Char(await getContractStorage(contract, "base_url"))
            );

            const account = await wallet.client.getActiveAccount();
            if (account) {
                setActiveAccount(account.address);
            }
            setFloorPrice(await getFloorPrice(contract));
        };

        fetchStorage().catch(console.error);
        setDisableMintOnMobile(
            series.find((e) => e.contract === contract)
                ?.disableMintingOnMobile || false
        );
    }, [contract, wallet, series]);

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
                </div>
                <p>--</p>
                {numTokensMinted} / {numTokens}
                <br />
                <SeriesPrice
                    soldOut={soldOut}
                    price={price}
                    floorPrice={floorPrice}
                />
                {new Date() < releaseDate && (
                    <span>
                        <br />
                        <br />
                        planned release: {releaseDate.toLocaleString()}
                    </span>
                )}
                {(width >= 768 || !disableMintOnMobile) && (
                    <Editor
                        contract={contract}
                        price={price}
                        showButton={
                            numTokensMinted !== numTokens &&
                            (activeAccount === artist || !paused)
                        }
                        baseUrl={baseUrl}
                    />
                )}
                {width < 768 && disableMintOnMobile && (
                    <div
                        style={{
                            border: "solid black 1px",
                            width: "min(80vw, 300px)",
                            padding: "5px",
                        }}
                    >
                        Minting for this token is disabled on mobile
                    </div>
                )}
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
