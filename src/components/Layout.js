import SyncButton from "./SyncButton";
import { Link } from "react-router-dom";

function Layout({ children, favicon = "/favicon.png" }) {
    return (
        <div
            style={{
                paddingLeft: "10vw",
                paddingRight: "10vw",
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
                            <li key="Mint">
                                <span className="menu-item">
                                    <Link to="/mint">Mint</Link>
                                </span>
                            </li>
                            <li key="Marketplace">
                                <span className="menu-item">
                                    <Link to="/marketplace">Marketplace</Link>
                                </span>
                            </li>
                            <li key="MyCollection">
                                <span className="menu-item">
                                    <Link to="/my-collection">
                                        My collection
                                    </Link>
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
        </div>
    );
}

export default Layout;
