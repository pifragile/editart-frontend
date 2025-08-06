import "terminal.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { React, useState, createContext } from "react";
import Home from "./components/Home";
import TokenDetail from "./components/TokenDetail";
import User from "./components/User";
import MarketPlace from "./components/Marketplace";
import Series from "./components/Series";
import About from "./components/About";


import { WalletContext, beaconWallet } from "./lib/wallet";
import ArtistPanel from "./components/ArtistPanel";
import Sandbox from "./components/Sandbox";
import SeriesOverview from "./components/SeriesOverview";
import { useEffect } from "react";
import { BACKEND_URL, ENV } from "./consts";
import Feed from "./components/Feed";
import { CacheProvider } from "./lib/context";
import SeriesSubmissionCreate from "./components/SeriesSubmissionCreate";
import SeriesSubmissionEdit from "./components/SeriesSubmissionEdit";
import ArtistDocs from "./components/ArtistDocs";
import SeriesValidation from "./components/SeriesValidation";
import { fetchAllContractData } from "./lib/api";
import Analytics from "./components/Analytics";
import IframeGrid from "./components/IFrameGrid";
import Admin from "./components/Admin";

// Context for Tezos/USD exchange rate
export const TezosUsdContext = createContext({ rate: null, lastUpdated: null });

export const ModeContext = createContext(0);
export const SeriesContext = createContext([]);


function App() {
    const [wallet] = useState(beaconWallet);
    const [mode, setMode] = useState(0);
    const [series, setSeries] = useState([]);
    const [tezosUsd, setTezosUsd] = useState({ rate: null, lastUpdated: null });

    useEffect(() => {
        async function action() {
            const res = await fetch(`${BACKEND_URL}series`);

            let seriesList = await res.json();
            if (ENV === "prod")
                seriesList = seriesList.filter((e) => e.mainnetContract !== "");
            else
                seriesList = seriesList.filter((e) => e.testnetContract !== "");

            seriesList.forEach((e) => {
                e.contract =
                    ENV === "prod" ? e.mainnetContract : e.testnetContract;
            });

            // const contracts = seriesList.map((e) => e.contract);
            // const allContracts = await fetchAllContractData(contracts);
            // seriesList.forEach(
            //     (s) =>
            //         (s.contractData = allContracts.find(
            //             (c) => c.address == s.contract
            //         ))
            // );
            setSeries(seriesList.reverse());
        }
        action().catch(console.error);
    }, []);

    // Fetch Tezos/USD exchange rate
    useEffect(() => {
        async function fetchTezosUsd() {
            try {
                // Using CoinGecko public API for XTZ/USD
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd"
                );
                const data = await res.json();
                if (data && data.tezos && data.tezos.usd) {
                    setTezosUsd({ rate: data.tezos.usd, lastUpdated: new Date() });
                }
            } catch (e) {
                console.error("Failed to fetch Tezos/USD rate", e);
            }
        }
        fetchTezosUsd();
    }, []);

    return (
        <WalletContext.Provider value={wallet}>
            <ModeContext.Provider value={{ mode, setMode }}>
                <SeriesContext.Provider value={series}>
                    <TezosUsdContext.Provider value={tezosUsd}>
                        <CacheProvider>
                            <div className="App">
                                <Routes>
                                    <Route
                                        path="/series/:contract/grid"
                                        element={<IframeGrid />}
                                    />
                                </Routes>
                            </div>
                        </CacheProvider>
                    </TezosUsdContext.Provider>
                </SeriesContext.Provider>
            </ModeContext.Provider>
        </WalletContext.Provider>
    );
}
export default App;
