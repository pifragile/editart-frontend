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

export const ModeContext = createContext(0);

function App() {
    const [wallet] = useState(beaconWallet);
    const [mode, setMode] = useState(0);

    return (
        <WalletContext.Provider value={wallet}>
            <ModeContext.Provider value={{ mode, setMode }}>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/token-detail/:contract/:tokenId"
                            element={<TokenDetail />}
                        />
                        <Route path="/user/:address" element={<User />} />
                        <Route path="/marketplace" element={<MarketPlace />} />
                        <Route path="/series/:contract" element={<Series />} />
                        <Route
                            path="/artist-panel/:contract"
                            element={<ArtistPanel />}
                        />
                        <Route path="/sandbox/" element={<Sandbox />} />
                        <Route
                            path="/series-overview/"
                            element={<SeriesOverview />}
                        />
                    </Routes>
                </div>
            </ModeContext.Provider>
        </WalletContext.Provider>
    );
}

export default App;
