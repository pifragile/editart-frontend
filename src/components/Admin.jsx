import React, { useState, useEffect } from "react";
import { BACKEND_URL, APP_URL } from "../consts";
import LayoutAdmin from "./LayoutAdmin";

const TEZ_ADDRESS = "tz1YysPgZN7fjGbCLYN5SLSZDXCi78zoeyrY";
const TZKT_MAINNET = "https://api.tzkt.io/v1/accounts/";
const TZKT_GHOSTNET = "https://api.ghostnet.tzkt.io/v1/accounts/";


function Admin() {
    const [status, setStatus] = useState(null);
    const [username, setUsername] = useState("");
    const [series, setSeries] = useState([]);
    const [editedSeries, setEditedSeries] = useState({});
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loadingRestart, setLoadingRestart] = useState(false);
    const [viewType, setViewType] = useState("submissions");
    const [restartPreviewOutput, setRestartPreviewOutput] = useState("");
    const [message, setMessage] = useState("");

    const [mainnetBalance, setMainnetBalance] = useState(null);
    const [ghostnetBalance, setGhostnetBalance] = useState(null);

    // Fetch balances on mount
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const [mainnetRes, ghostnetRes] = await Promise.all([
                    fetch(`${TZKT_MAINNET}${TEZ_ADDRESS}`),
                    fetch(`${TZKT_GHOSTNET}${TEZ_ADDRESS}`),
                ]);
                if (mainnetRes.ok) {
                    const data = await mainnetRes.json();
                    setMainnetBalance(data.balance / 1_000_000);
                }
                if (ghostnetRes.ok) {
                    const data = await ghostnetRes.json();
                    setGhostnetBalance(data.balance / 1_000_000);
                }
            } catch (err) {
                console.error("Failed to fetch balances", err);
            }
        };
        fetchBalances();
    }, []);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}me`, {
                    credentials: "include",
                });
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
                const response = await fetch(
                    `${BACKEND_URL}admin/series/${uid}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );
                if (response.status === 200) {
                    setSeries(series.filter((item) => item.uid !== uid));
                }
            } catch (error) {
                console.error("Failed to delete series", error);
            }
        }
    };

    const handleDeployMainnet = async (uid) => {
        if (
            window.confirm(
                "Are you sure you want to deploy this series to the mainnet?"
            )
        ) {
            try {
                const response = await fetch(
                    `${BACKEND_URL}admin/deploy-mainnet/${uid}`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );
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
            let polling = true;
            setRestartPreviewOutput(""); // Clear previous output
            fetch(`${BACKEND_URL}admin/restart-previews`, {
                method: "POST",
                credentials: "include",
            }).then((response) => {
                polling = false; // Stop polling after the request
                if (response.status === 200) {
                    alert("Preview server restarted successfully.");
                    setLoadingRestart(false);
                } else {
                    alert("Failed to restart preview server.");
                }
            });
            // Poll for output
            const pollOutput = async () => {
                while (polling) {
                    try {
                        const res = await fetch(
                            `${BACKEND_URL}admin/restart-previews-output`,
                            {
                                credentials: "include",
                            }
                        );
                        if (res.status === 200) {
                            const data = await res.json();
                            // Clean output to remove unwanted ANSI codes and cron lines
                            let cleanedOutput = data.output
                                .replace(/\u001b\[[0-9;]*m/g, "") // Remove ANSI color codes
                                .replace(/\u001b\[\?25[hl]/g, "") // Remove cursor show/hide
                                .replace(/\u001b\[[0-9]*[A-G]/g, ""); // Remove cursor movement

                            setRestartPreviewOutput(cleanedOutput);
                        }
                    } catch (err) {
                        console.error("Failed to fetch restart output", err);
                    }
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            };
            pollOutput();
        } catch (error) {
            console.error("Failed to restart preview server", error);
        } finally {
        }
    };

    const handleUpdateSeries = async (seriesId, updatedFields) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}admin/series/${seriesId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedFields),
                }
            );
            if (response.status === 200) {
                alert("Series updated successfully.");
                const updatedSeries = series.map((item) =>
                    item._id === seriesId ? { ...item, ...updatedFields } : item
                );
                setSeries(updatedSeries);
            } else {
                alert("Failed to update series.");
            }
        } catch (error) {
            console.error("Failed to update series", error);
        }
    };

    useEffect(() => {
        const fetchSeriesData = async () => {
            if (status === 200) {
                try {
                    const response = await fetch(`${BACKEND_URL}admin/series`, {
                        credentials: "include",
                    });
                    const data = await response.json();
                    setSeries(data);
                    // Initialize editedSeries with a shallow copy of editable fields
                    const initialEdited = {};
                    data.forEach((item) => {
                        initialEdited[item._id] = {
                            plannedRelease: item.plannedRelease || "",
                            renderingQueueName: item.renderingQueueName || "default",
                            featured: item.featured || false,
                            displayArtifact: item.displayArtifact || false,
                            disableMintingOnMobile: item.disableMintingOnMobile || false,
                            disabled: item.disabled || false,
                            showGrid: item.showGrid || false,
                        };
                    });
                    setEditedSeries(initialEdited);
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
                <div style={{ fontSize: "small" }}>
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
                    <div style={{ marginBottom: "20px" }}>
                        <strong>Tez Balances for {TEZ_ADDRESS}:</strong>
                        <div>Mainnet: {mainnetBalance === null ? "..." : `${mainnetBalance} ꜩ`}</div>
                        <div>Ghostnet: {ghostnetBalance === null ? "..." : `${ghostnetBalance} ꜩ`}</div>
                    </div>
                    <div style={{ whiteSpace: "pre-line" }}>
                        {restartPreviewOutput}
                    </div>

                    <div style={{ whiteSpace: "pre-line" }}>{message}</div>
                    <div style={{ marginBottom: "20px", width: "400px" }}>
                        <h1>Manual Trigger</h1>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const net = formData.get("net");
                                const contract = formData.get("contract");
                                const tokenId = formData.get("token_id");

                                try {
                                    const response = await fetch(
                                        `${BACKEND_URL}admin/manual-trigger`,
                                        {
                                            method: "POST",
                                            credentials: "include",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                net,
                                                contract,
                                                token_id: tokenId,
                                            }),
                                        }
                                    );
                                    if (response.status === 200) {
                                        alert("Manual trigger successful.");
                                    } else {
                                        alert("Failed to trigger manually.");
                                    }
                                } catch (error) {
                                    console.error(
                                        "Failed to trigger manually",
                                        error
                                    );
                                }
                            }}
                        >
                            <input
                                type="text"
                                name="contract"
                                placeholder="Contract"
                                required
                            />
                            <input
                                type="text"
                                name="token_id"
                                placeholder="Token ID"
                                required
                            />
                            <select name="net" required>
                                <option value="mainnet">Mainnet</option>
                                <option value="ghostnet">Ghostnet</option>
                            </select>
                            <button type="submit" className="btn btn-default">
                                Trigger
                            </button>
                        </form>
                    </div>
                    <h2>Series:</h2>
                    <div style={{ marginBottom: "20px", width: "200px" }}>
                        <select
                            onChange={(e) => setViewType(e.target.value)}
                            value={viewType}
                        >
                            <option value="submissions">Submissions</option>
                            <option value="series">Series</option>
                        </select>
                    </div>
                    <table
                        border="1"
                        style={{
                            width: "100%",
                            textAlign: "left",
                            fontSize: "small",
                        }}
                    >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Artist Name</th>
                                <th>Price</th>
                                <th style={{ width: "100px" }}>Editions</th>
                                <th>Planned Release</th>
                                <th style={{ width: "150px" }}>Links</th>
                                <th>Rendering Queue Name</th>
                                <th style={{ width: "50px" }}>Featured</th>
                                <th style={{ width: "50px" }}>
                                    Display Artifact
                                </th>
                                <th style={{ width: "50px" }}>
                                    Disable Minting on Mobile
                                </th>
                                <th style={{ width: "50px" }}>Disabled</th>
                                <th style={{ width: "50px" }}>Show Grid</th>
                                <th>Update</th>
                                <th>Delete</th>
                                <th>Deploy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {series
                                .filter((item) =>
                                    viewType === "series"
                                        ? item.mainnetContract
                                        : !item.mainnetContract
                                )
                                .slice()
                                .sort((a, b) => {
                                    // Use original series plannedRelease for sorting, not edited value
                                    const dateA = a.plannedRelease
                                        ? new Date(a.plannedRelease)
                                        : null;
                                    const dateB = b.plannedRelease
                                        ? new Date(b.plannedRelease)
                                        : null;
                                    if (!dateA) return 1;
                                    if (!dateB) return -1;
                                    return dateB - dateA;
                                })
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td
                                            onClick={() =>
                                                item.mainnetContract &&
                                                setMessage(`the project is live on mainnet🥳
series: https://editart.xyz/series/${item.mainnetContract}
artist-panel: https://editart.xyz/artist-panel/${item.mainnetContract}
the final steps are described here:
https://www.editart.xyz/artist-docs#deployment-to-mainnet
let me know if you need any help :)`)
                                            }
                                        >
                                            {item.name}
                                        </td>
                                        <td>{item.artistName}</td>
                                        <td>
                                            {parseInt(
                                                item.contractData.storage.price
                                            ) / 1000000}
                                        </td>
                                        <td>
                                            {parseInt(
                                                item.contractData.storage
                                                    .last_token_id
                                            )}{" "}
                                            /{" "}
                                            {parseInt(
                                                item.contractData.storage
                                                    .num_tokens
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="datetime-local"
                                                value={(() => {
                                                    const val = editedSeries[item._id]?.plannedRelease;
                                                    if (!val) return "";
                                                    const d = new Date(val);
                                                    if (!isNaN(d.getTime())) {
                                                        const tzOffset = d.getTimezoneOffset() * 60000;
                                                        const localISO = new Date(d.getTime() - tzOffset)
                                                            .toISOString()
                                                            .slice(0, 16);
                                                        return localISO;
                                                    }
                                                    return "";
                                                })()}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            plannedRelease: val ? new Date(val).toISOString() : "",
                                                        },
                                                    }));
                                                }}
                                                style={{ width: "180px" }}
                                                onKeyDown={(e) => e.preventDefault()}
                                                inputMode="none"
                                                pattern=""
                                                readOnly
                                                onFocus={(e) => e.target.removeAttribute("readonly")}
                                            />
                                        </td>
                                        <td>
                                            <details>
                                                <summary>Links</summary>
                                                <div>
                                                    <a
                                                        href={`${APP_URL}series-submission/${item.uid}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Submission
                                                    </a>
                                                </div>
                                                {item.testnetContract && (
                                                    <div>
                                                        <a
                                                            href={`https://testnet.editart.xyz/series/${item.testnetContract}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Testnet
                                                        </a>
                                                    </div>
                                                )}
                                                {item.mainnetContract && (
                                                    <div>
                                                        <a
                                                            href={`https://editart.xyz/series/${item.mainnetContract}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Mainnet
                                                        </a>
                                                    </div>
                                                )}
                                                {item.mainnetContract && (
                                                    <div>
                                                        <a
                                                            href={`https://better-call.dev/mainnet/${item.mainnetContract}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Contract
                                                        </a>
                                                    </div>
                                                )}
                                                {item.testnetContract && (
                                                    <div>
                                                        <a
                                                            href={`https://better-call.dev/ghostnet/${item.testnetContract}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Contract(T)
                                                        </a>
                                                    </div>
                                                )}
                                            </details>
                                        </td>
                                        <td>
                                            <select
                                                value={editedSeries[item._id]?.renderingQueueName || "default"}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            renderingQueueName: e.target.value,
                                                        },
                                                    }));
                                                }}
                                            >
                                                <option value="default">default</option>
                                                <option value="slow">slow</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={editedSeries[item._id]?.featured || false}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            featured: e.target.checked,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={editedSeries[item._id]?.displayArtifact || false}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            displayArtifact: e.target.checked,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={editedSeries[item._id]?.disableMintingOnMobile || false}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            disableMintingOnMobile: e.target.checked,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={editedSeries[item._id]?.disabled || false}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            disabled: e.target.checked,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={editedSeries[item._id]?.showGrid || false}
                                                onChange={(e) => {
                                                    setEditedSeries((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            showGrid: e.target.checked,
                                                        },
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleUpdateSeries(
                                                        item._id,
                                                        editedSeries[item._id]
                                                    )
                                                }
                                                className="btn btn-default"
                                            >
                                                Update
                                            </button>
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
