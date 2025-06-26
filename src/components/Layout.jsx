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

    const tiggerMode = (i) => [triggerLightMode, triggerDarkMode][i]();

    useEffect(() => {
        const savedMode = parseInt(
            document.cookie.replace(
                /(?:(?:^|.*;\s*)mode\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
            ),
            10
        );
        if (!isNaN(savedMode)) {
            setMode(savedMode);
            tiggerMode(savedMode);
        }
    }, []);

    useEffect(() => {
        document.cookie = `mode=${mode}; path=/; max-age=31536000`; // Store mode in a cookie for 1 year
    }, [mode]);

    const toggleMode = () => {
        const newMode = (mode + 1) % 2;
        setMode(newMode);
        tiggerMode(newMode);
    };

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

    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu when route changes or on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="main-div">
            <header>
                <div className="terminal-nav">
                    <div className="terminal-logo">
                        <div className="logo terminal-prompt">
                            <span className="no-style">
                                <Link to="/">EditArt</Link>
                            </span>
                        </div>
                    </div>
                    <button
                        className="hamburger"
                        aria-label="Toggle menu"
                        onClick={toggleMenu}
                        style={{
                            display: "block",
                            background: "none",
                            border: "none",
                            fontSize: "2rem",
                            cursor: "pointer",
                        }}
                    >
                        &#9776;
                    </button>
                    <nav className={`terminal-menu${menuOpen ? " open" : ""}`}>
                        <ul>
                            <li key="Series">
                                <span className="menu-item">
                                    <Link
                                        to="/series-overview"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Series
                                    </Link>
                                </span>
                            </li>
                            <li key="Feed">
                                <span className="menu-item">
                                    <Link
                                        to="/feed"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Feed
                                    </Link>
                                </span>
                            </li>
                            <li key="MyCollection">
                                <span className="menu-item">
                                    <Link
                                        to={`/user/${activeAccount}`}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        My collection
                                    </Link>
                                </span>
                            </li>
                            <li key="About">
                                <span className="menu-item">
                                    <Link
                                        to="/about"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        About
                                    </Link>
                                </span>
                            </li>
                            <li key="Mode">
                                <span
                                    className="menu-item"
                                    onClick={() => {
                                        toggleMode();
                                        setMenuOpen(false);
                                    }}
                                >
                                    <Link>Dark/Light</Link>
                                </span>
                            </li>
                            <li>
                                {" "}
                                <SyncButton />
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <div className="content">{children}</div>
            <footer>
                <br />
                Built with{" "}
                <a href="https://tzkt.io" target="_blank" rel="noreferrer">
                    TzKT API
                </a>
            </footer>
            <style>{`
                @media (max-width: 768px) {
                    .terminal-menu {
                        display: none;
                    }
                    .terminal-menu.open {
                        display: block;
                    }
                    .hamburger {
                        display: block !important;
                        position: absolute;
                        right: 60px;
                        top: 12px;
                    }

                }
                @media (min-width: 769px) {
                    .hamburger {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Layout;
