import React, { useState, useEffect } from "react";
import { BACKEND_URL, APP_URL } from "../consts";
import LayoutAdmin from "./LayoutAdmin";

function Admin() {
    const [status, setStatus] = useState(null);
    const [username, setUsername] = useState("");
    const [series, setSeries] = useState([]);
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loadingRestart, setLoadingRestart] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}me`, { credentials: "include" });
                if (response.status === 200) {
                    const data = await response.json();
                    setStatus(200);
                    setUsername(data.username);
                } else if (response.status === 403) {
                    setStatus(403);
                }
            } catch (error) {
                console.error("Failed to check authentication status", error);
            }
        };
        checkAuthStatus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });
            if (response.status === 200) {
                const data = await response.json();
                setStatus(200);
                setUsername(data.username);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.status === 200) {
                setStatus(null);
                setUsername("");
                setSeries([]);
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleDelete = async (uid) => {
        if (window.confirm("Are you sure you want to delete this series?")) {
            try {
                const response = await fetch(`${BACKEND_URL}admin/series/${uid}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (response.status === 200) {
                    setSeries(series.filter((item) => item.uid !== uid));
                }
            } catch (error) {
                console.error("Failed to delete series", error);
            }
        }
    };

    const handleDeployMainnet = async (uid) => {
        if (window.confirm("Are you sure you want to deploy this series to the mainnet?")) {
            try {
                const response = await fetch(`${BACKEND_URL}admin/deploy-mainnet/${uid}`, {
                    method: "POST",
                    credentials: "include",
                });
                if (response.status === 200) {
                    alert("Series successfully deployed to the mainnet.");
                } else {
                    alert("Failed to deploy to the mainnet.");
                }
            } catch (error) {
                console.error("Failed to deploy to the mainnet", error);
            }
        }
    };

    const handleRestartPreviews = async () => {
        setLoadingRestart(true);
        try {
            const response = await fetch(`${BACKEND_URL}admin/restart-previews`, {
                method: "POST",
                credentials: "include",
            });
            if (response.status === 200) {
                alert("Preview server restarted successfully.");
            } else {
                alert("Failed to restart preview server.");
            }
        } catch (error) {
            console.error("Failed to restart preview server", error);
        } finally {
            setLoadingRestart(false);
        }
    };

    useEffect(() => {
        const fetchSeriesData = async () => {
            if (status === 200) {
                try {
                    const response = await fetch(`${BACKEND_URL}admin/series`, { credentials: "include" });
                    const data = await response.json();
                    setSeries(data);
                } catch (error) {
                    console.error("Failed to fetch series", error);
                }
            }
        };
        fetchSeriesData();
    }, [status]);

    if (status === 403) {
        return (
            <LayoutAdmin>
                <div
                    style={{
                        width: "50%",
                        textAlign: "center",
                        marginTop: "50px",
                    }}
                >
                    <p>You are not logged in. Please log in to continue.</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={(e) =>
                                setLoginData({
                                    ...loginData,
                                    username: e.target.value,
                                })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) =>
                                setLoginData({
                                    ...loginData,
                                    password: e.target.value,
                                })
                            }
                        />
                        <button type="submit" className="btn btn-default">
                            Login
                        </button>
                    </form>
                </div>
            </LayoutAdmin>
        );
    }

    if (status === 200) {
        return (
            <LayoutAdmin>
                <div>
                    <h1>Welcome, {username}</h1>
                    <div style={{ marginBottom: "20px" }}>
                        <button
                            onClick={handleLogout}
                            className="btn btn-default"
                            style={{ marginRight: "10px" }}
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleRestartPreviews}
                            className="btn btn-default"
                            disabled={loadingRestart}
                        >
                            {loadingRestart ? (
                                <div className="spinner" />
                            ) : (
                                "Restart Preview Server"
                            )}
                        </button>
                    </div>
                    <h2>Submissions:</h2>
                    <table
                        border="1"
                        style={{ width: "100%", textAlign: "left" }}
                    >
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Name</th>
                                <th>Artist Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Num Editions</th>
                                <th>Testnet</th>
                                <th>Mainnet</th>
                                <th>Planned Release</th>
                                <th>Link</th>
                                <th>Delete</th>
                                <th>Deploy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {series.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.uid}</td>
                                    <td>{item.name}</td>
                                    <td>{item.artistName}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                    <td>{item.numEditions}</td>
                                    <td>{item.mainnetContract ? "" : item.testnetContract}</td>
                                    <td>{item.mainnetContract}</td>
                                    <td>
                                        {item.plannedRelease
                                            ? new Date(
                                                  item.plannedRelease
                                              ).toLocaleString()
                                            : "N/A"}
                                    </td>
                                    <td>
                                        <a
                                            href={`${APP_URL}series-submission/${item.uid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Submission
                                        </a>
                                    </td>
                                    <td>
                                        {!item.mainnetContract && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.uid)
                                                }
                                                className="btn btn-default"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {!item.mainnetContract && (
                                            <button
                                                onClick={() =>
                                                    handleDeployMainnet(
                                                        item.uid
                                                    )
                                                }
                                                className="btn btn-default"
                                            >
                                                Deploy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </LayoutAdmin>
        );
    }

    return <p>Loading...</p>;
}

export default Admin;
