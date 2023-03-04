import SyncButton from "./SyncButton";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { WalletContext } from "../lib/wallet";
import { ModeContext } from "../App";

function Layout({ children, favicon = "/favicon.png" }) {
    const client = useContext(WalletContext).client;
    const [activeAccount, setActiveAccount] = useState(null);
    const { mode, setMode } = useContext(ModeContext);
    useEffect(() => {
        const func = async () => {
            const account = await client.getActiveAccount();
            if (account) {
                setActiveAccount(account.address);
            }
        };
        func();
    }, [client]);

    const triggerDarkMode = () => {
        document.body.style.setProperty("--background-color", "#1C1B1C");
        document.body.style.setProperty("--font-color", "#e8e9ed");
        document.body.style.setProperty("--invert-font-color", "#1C1B1C");
        document.body.style.setProperty("--secondary-color", "#a3abba");
        document.body.style.setProperty("--tertiary-color", "#a3abba");
        document.body.style.setProperty("--primary-color", "#62c4ff");
        document.body.style.setProperty("--error-color", "#ff3c74");
        document.body.style.setProperty("--progress-bar-background", "#3f3f44");
        document.body.style.setProperty("--progress-bar-fill", "#62c4ff");
        document.body.style.setProperty("--code-bg-color", "#3f3f44");
    };

    const triggerLightMode = () => {
        document.body.style.setProperty("--background-color", "#fff");
        document.body.style.setProperty("--font-color", "#151515");
        document.body.style.setProperty("--invert-font-color", "#fff");
        document.body.style.setProperty("--secondary-color", "#727578");
        document.body.style.setProperty("--tertiary-color", "#727578");
        document.body.style.setProperty("--primary-color", "#1a95e0");
        document.body.style.setProperty("--error-color", "#d20962");
        document.body.style.setProperty("--progress-bar-background", "#727578");
        document.body.style.setProperty("--progress-bar-fill", "#151515");
        document.body.style.setProperty("--code-bg-color", "#e8eff2");
    };

    const toggleMode = () => {
        [triggerDarkMode, triggerLightMode][mode]();
        setMode((mode + 1) % 2);
    };

    return (
        <div
            style={{
                paddingLeft: "10vw",
                paddingRight: "10vw",
                minHeight: "100vh",
                margin: 0,
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
            }}
        >
            <header>
                <div className="terminal-nav">
                    <div className="terminal-logo">
                        <div className="logo terminal-prompt">
                            <span className="no-style">
                                <Link to="/">EditART</Link>
                            </span>
                        </div>
                    </div>
                    <nav className="terminal-menu">
                        <ul>
                            <li key="Series">
                                <span className="menu-item">
                                    <Link to="/series-overview">Series</Link>
                                </span>
                            </li>
                            <li key="MyCollection">
                                <span className="menu-item">
                                    <Link to={`/user/${activeAccount}`}>
                                        My collection
                                    </Link>
                                </span>
                            </li>

                            <li key="About">
                                <span className="menu-item">
                                    <Link to="/about">About</Link>
                                </span>
                            </li>
                            <li key="Mode">
                                <span
                                    className="menu-item"
                                    onClick={toggleMode}
                                >
                                    <Link>Dark/Light</Link>
                                </span>
                            </li>
                        </ul>
                    </nav>
                    <SyncButton />
                </div>
            </header>
            <div
                className="content"
                style={{
                    marginTop: "5vh",
                }}
            >
                {children}
            </div>
            <footer>
                <br />
                Built with{" "}
                <a href="https://tzkt.io" target="_blank" rel="noreferrer">
                    TzKT API
                </a>
            </footer>
        </div>
    );
}

export default Layout;
