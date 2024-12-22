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

export const ModeContext = createContext(0);
export const SeriesContext = createContext([]);

function App() {
    const [wallet] = useState(beaconWallet);
    const [mode, setMode] = useState(0);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        async function action() {
            const res = await fetch(`${BACKEND_URL}series`);

            let seriesList = await res.json();
            if (ENV === "prod")
                seriesList = seriesList.filter((e) => e.showInFrontend);
            seriesList.forEach((e) => {
                e.contract =
                    ENV === "prod" ? e.mainnetContract : e.testnetContract;
            });


            const contracts = seriesList.map((e) => e.contract);
            const allContracts = await fetchAllContractData(contracts);
            seriesList.forEach(
                (s) =>
                    (s.contractData = allContracts.find(
                        (c) => c.address == s.contract
                    ))
            );
            setSeries(seriesList.reverse());
        }
        action().catch(console.error);
    }, []);

    return (
        <WalletContext.Provider value={wallet}>
            <ModeContext.Provider value={{ mode, setMode }}>
                <SeriesContext.Provider value={series}>
                    <CacheProvider>
                        <div className="App">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route
                                    path="/token-detail/:contract/:tokenId"
                                    element={<TokenDetail />}
                                />
                                <Route
                                    path="/user/:address"
                                    element={<User />}
                                />
                                <Route
                                    path="/marketplace"
                                    element={<MarketPlace />}
                                />
                                <Route
                                    path="/series/:contract"
                                    element={<Series />}
                                />
                                <Route
                                    path="/artist-panel/:contract"
                                    element={<ArtistPanel />}
                                />
                                <Route path="/sandbox/" element={<Sandbox />} />
                                <Route
                                    path="/series-overview/"
                                    element={<SeriesOverview />}
                                />
                                <Route path="/feed/" element={<Feed />} />
                                <Route
                                    path="/series-submission/"
                                    element={<SeriesSubmissionCreate />}
                                />
                                <Route
                                    path="/series-submission/:seriesId"
                                    element={<SeriesSubmissionEdit />}
                                />
                                <Route
                                    path="/artist-docs"
                                    element={<ArtistDocs />}
                                />
                                <Route
                                    path="/series-validation/:key"
                                    element={<SeriesValidation />}
                                />
                            </Routes>
                        </div>
                    </CacheProvider>
                </SeriesContext.Provider>
            </ModeContext.Provider>
        </WalletContext.Provider>
    );
}

export default App;
