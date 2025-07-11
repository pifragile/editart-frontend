import { Link, useParams } from "react-router-dom";

import Layout from "./Layout";

import { useContext, useEffect, useState } from "react";

import {
    getContractStorage,
    getContractMetadata,
    getFloorPrice,
    getContract,
    getContractStorageFull,
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
    const [releaseDate, setReleaseDate] = useState(true);
    const [showGrid, setShowGrid] = useState(false);

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
            const storage = await getContractStorageFull(contract);
            setNumTokens(storage.num_tokens);
            setPrice(storage.price);
            setNumTokensMinted(storage.last_token_id);
            if (storage.num_tokens === storage.last_token_id) setSoldOut(true);
            setArtist(storage.artist_address);

            setBaseUrl(bytes2Char(storage.base_url));

            setMetadata(await getContractMetadata(contract));
            setPaused(storage.paused);
            const contractData = await getContract(contract);
            let date =
                series.find((e) => e.contract === contract)?.plannedRelease ||
                contractData.firstActivityTime;

            let showGrid =
                series.find((e) => e.contract === contract)?.showGrid || false;

            setShowGrid(showGrid);
            date = new Date(date);

            setReleaseDate(
                date < new Date()
                    ? date.toLocaleDateString()
                    : date.toLocaleString()
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

    if (numTokens && metadata && releaseDate) {
        return (
            <Layout>
                {(width >= 768 || !disableMintOnMobile) && (
                    <Editor
                        contract={contract}
                        price={price}
                        showButton={
                            numTokensMinted !== numTokens &&
                            (activeAccount === artist || !paused)
                        }
                        baseUrl={baseUrl}
                        seriesData={{
                            numTokensMinted,
                            numTokens,
                            artist,
                            metadata,
                            floorPrice,
                            soldOut,
                            price,
                            releaseDate,
                            showGrid,
                        }}
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
                {activeAccount === artist && (
                    <Link to={`/artist-panel/${contract}`}>
                        <button
                            className="btn btn-default"
                            style={{ marginTop: "5vh" }}
                        >
                            Artist Panel
                        </button>
                    </Link>
                )}
                <div style={{ marginTop: "5vh" }}>
                    <MarketPlace contract={contract}></MarketPlace>
                </div>
                <div style={{ marginTop: "5vh" }}>
                    <h1>All tokens</h1>
                    <TokenOverview
                        query={`v1/tokens?contract=${contract}&sort.${
                            numTokens === numTokensMinted ? "asc" : "desc"
                        }=firstTime`}
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
