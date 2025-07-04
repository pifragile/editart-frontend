import React, { useState, useEffect } from "react";
import { BACKEND_URL, APP_URL } from "../consts";
import LayoutAdmin from "./LayoutAdmin";

function Admin() {
    const [status, setStatus] = useState(null);
    const [username, setUsername] = useState("");
    const [series, setSeries] = useState([]);
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loadingRestart, setLoadingRestart] = useState(false);
    const [viewType, setViewType] = useState("submissions");
    const [restartPreviewOutput, setRestartPreviewOutput] = useState("");
    const [message, setMessage] = useState("");

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
                                    const dateA = a.plannedRelease
                                        ? new Date(a.plannedRelease)
                                        : null;
                                    const dateB = b.plannedRelease
                                        ? new Date(b.plannedRelease)
                                        : null;
                                    if (!dateA) return 1; // Place items without plannedRelease at the end
                                    if (!dateB) return -1;
                                    return dateB - dateA; // Sort by descending order
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
                                                value={
                                                    item.plannedRelease
                                                        ? (() => {
                                                              const d =
                                                                  new Date(
                                                                      item.plannedRelease
                                                                  );
                                                              if (
                                                                  !isNaN(
                                                                      d.getTime()
                                                                  )
                                                              ) {
                                                                  const tzOffset =
                                                                      d.getTimezoneOffset() *
                                                                      60000;
                                                                  const localISO =
                                                                      new Date(
                                                                          d.getTime() -
                                                                              tzOffset
                                                                      )
                                                                          .toISOString()
                                                                          .slice(
                                                                              0,
                                                                              16
                                                                          );
                                                                  return localISO;
                                                              }
                                                              return "";
                                                          })()
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          plannedRelease:
                                                                              val
                                                                                  ? new Date(
                                                                                        val
                                                                                    ).toISOString()
                                                                                  : "",
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                                style={{ width: "180px" }}
                                                onKeyDown={(e) =>
                                                    e.preventDefault()
                                                } // Prevent manual typing
                                                inputMode="none" // Mobile: disables keyboard
                                                pattern="" // Prevents some browsers from allowing text
                                                readOnly
                                                onFocus={
                                                    (e) =>
                                                        e.target.removeAttribute(
                                                            "readonly"
                                                        ) // Allow picker on focus
                                                }
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
                                                value={
                                                    item.renderingQueueName ||
                                                    ""
                                                }
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          renderingQueueName:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            >
                                                <option value="default">
                                                    default
                                                </option>
                                                <option value="slow">
                                                    slow
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={item.featured || false}
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          featured:
                                                                              e
                                                                                  .target
                                                                                  .checked,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    item.displayArtifact ||
                                                    false
                                                }
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          displayArtifact:
                                                                              e
                                                                                  .target
                                                                                  .checked,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={
                                                    item.disableMintingOnMobile ||
                                                    false
                                                }
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          disableMintingOnMobile:
                                                                              e
                                                                                  .target
                                                                                  .checked,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={item.disabled || false}
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          disabled:
                                                                              e
                                                                                  .target
                                                                                  .checked,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={item.showGrid || false}
                                                onChange={(e) => {
                                                    const updatedSeries =
                                                        series.map(
                                                            (seriesItem) =>
                                                                seriesItem._id ===
                                                                item._id
                                                                    ? {
                                                                          ...seriesItem,
                                                                          showGrid:
                                                                              e
                                                                                  .target
                                                                                  .checked,
                                                                      }
                                                                    : seriesItem
                                                        );
                                                    setSeries(updatedSeries);
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleUpdateSeries(
                                                        item._id,
                                                        {
                                                            renderingQueueName:
                                                                item.renderingQueueName,
                                                            featured:
                                                                item.featured,
                                                            displayArtifact:
                                                                item.displayArtifact,
                                                            disableMintingOnMobile:
                                                                item.disableMintingOnMobile,
                                                            disabled:
                                                                item.disabled,
                                                            showGrid:
                                                                item.showGrid,
                                                            plannedRelease:
                                                                item.plannedRelease,
                                                        }
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
