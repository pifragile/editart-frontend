import React, { useEffect, useState } from "react";
import { APP_URL, BACKEND_URL } from "../consts";
import ReloadIframe from "./ReloadIframe";
import { Link } from "react-router-dom";

function localToUTCString(localDateStr) {
    const formatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!formatRegex.test(localDateStr)) {
        throw new Error("Invalid format. Expected format: 'YYYY-MM-DD HH:MM'");
    }

    // localDateStr format: "YYYY-MM-DD HH:MM"
    const [datePart, timePart] = localDateStr.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Create a Date object in local time
    const localDate = new Date(year, month - 1, day, hour, minute);

    // Extract the UTC components
    const utcYear = localDate.getUTCFullYear();
    const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(localDate.getUTCDate()).padStart(2, "0");
    const utcHour = String(localDate.getUTCHours()).padStart(2, "0");
    const utcMinute = String(localDate.getUTCMinutes()).padStart(2, "0");

    // Return in "YYYY-MM-DD HH:MM" format as UTC
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHour}:${utcMinute}`;
}

function SeriesSubmissionForm({ seriesId }) {
    const [formData, setFormData] = useState({
        artistName: "",
        artistAddress: "",
        artistAddressTestnet: "",
        name: "",
        description: "",
        //plannedRelease: "", // "YYYY-MM-DD HH:MM" format
        numEditions: "",
        price: "",
        zipfile: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(!!seriesId);
    const [createdId, setCreatedId] = useState(null);
    const [previewKeys, setPreviewKeys] = useState(null);
    const [testDirKey, setTestDirKey] = useState(null);
    const [testnetContract, setTestnetContract] = useState(null);
    const [showTestnetAddress, setShowTestnetAddress] = useState(false);
    const [mainnetContract, setMainnetContract] = useState(false);
    const [plannedRelease, setPlannedRelease] = useState("");

    const fetchData = async () => {
        try {
            if (!seriesId) return;
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}series/${seriesId}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch series.");
            }

            const data = await res.json();

            // Convert ISO datetime to "YYYY-MM-DD HH:MM"
            if (data.plannedRelease) {
                const dt = new Date(data.plannedRelease);

                // Extract local date and time components
                const year = dt.getFullYear().toString().padStart(4, "0");
                const month = (dt.getMonth() + 1).toString().padStart(2, "0");
                const day = dt.getDate().toString().padStart(2, "0");
                const hours = dt.getHours().toString().padStart(2, "0");
                const mins = dt.getMinutes().toString().padStart(2, "0");

                var formattedRelease = `${year}-${month}-${day} ${hours}:${mins}`;
            } else {
                var formattedRelease = "";
            }

            setPlannedRelease(formattedRelease);

            if (data.mainnetContract) {
                setMainnetContract(data.mainnetContract);
                return;
            }
            setFormData({
                artistName: data.artistName || "",
                artistAddress: data.artistAddress || "",
                artistAddressTestnet: data.artistAddressTestnet || "",
                name: data.name || "",
                description: data.description || "",
                // plannedRelease: formattedRelease,
                numEditions: data.numEditions
                    ? data.numEditions.toString()
                    : "",
                price: data.price !== null ? data.price.toString() : "",
                zipfile: null, // never prefilled
            });
            setPreviewKeys(data.previewKeys);
            setTestDirKey(data.testDirKey);
            setTestnetContract(data.testnetContract);
            setShowTestnetAddress(data.artistAddressTestnet !== "");
            console.log("Data fetched.");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!seriesId) {
            setFormData({
                price: "0",
                numEditions: "1000",
            });
            return;
        }

        fetchData();
    }, [seriesId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "zipfile") {
            setFormData((prev) => ({ ...prev, zipfile: files[0] || null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (isUpdate && testnetContract) {
            const confirmMessage =
                "This series has already been deployed to the testnet. " +
                "Making changes now will require redeployment to the testnet. " +
                "Are you sure you want to proceed?";
            if (!window.confirm(confirmMessage)) {
                return;
            }
        }

        // Validate required fields for creation
        if (!isUpdate) {
            const requiredFields = [
                "artistName",
                "artistAddress",
                "name",
                "description",
                //"plannedRelease",
                "numEditions",
                "price",
                "zipfile",
            ];

            for (const field of requiredFields) {
                if (!formData[field] || formData[field] === "") {
                    setError(`Missing required field: ${field}`);
                    return;
                }
            }
        }

        // const plannedReleaseRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        // if (!plannedReleaseRegex.test(formData.plannedRelease)) {
        //     setError("Planned Release must be in format YYYY-MM-DD HH:MM");
        //     return;
        // }
        setLoading(true);

        try {
            const form = new FormData();
            form.append("artistName", formData.artistName);
            form.append("artistAddress", formData.artistAddress);
            form.append(
                "artistAddressTestnet",
                formData.artistAddressTestnet || ""
            );
            form.append("name", formData.name);
            form.append("description", formData.description);
            // form.append(
            //     "plannedRelease",
            //     localToUTCString(formData.plannedRelease)
            // );
            form.append("numEditions", formData.numEditions);
            form.append("price", formData.price);

            if (formData.zipfile) {
                form.append("zipfile", formData.zipfile);
            }

            const method = isUpdate ? "PATCH" : "POST";
            const url = isUpdate
                ? `${BACKEND_URL}series/${seriesId}`
                : `${BACKEND_URL}series`;

            const res = await fetch(url, {
                method,
                body: form,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Operation failed.");
            }

            const data = await res.json();
            console.log(data);
            setCreatedId(data.id);
            // handle success, maybe redirect or show a success message
        } catch (e) {
            setError(e.message);
        } finally {
            await fetchData();
        }
    };

    const handleDeployTestnet = async () => {
        try {
            setLoading(true);
            let res = await fetch(
                `${BACKEND_URL}series/${seriesId}/deploy-testnet`
            );
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Operation failed.");
            }
        } catch (e) {
            console.log(e.message);
            setError(e.message);
        } finally {
            await fetchData();
        }
    };

    if (mainnetContract) {
        return (
            <div>
                <p>
                    This series has already been deployed to the mainnet.
                    <br />
                    <a
                        href={`https://editart.xyz/series/${mainnetContract}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Series
                    </a>
                    <br />
                    <a
                        href={`https://editart.xyz/artist-panel/${mainnetContract}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Artist Panel
                    </a>
                    <br />
                </p>
            </div>
        );
    }
    if (createdId) {
        const seriesLink = `${APP_URL}series-submission/${createdId}`;
        return (
            <div>
                <p> Your series was submitted!</p>
                <br></br>
                <p>
                    Below you can find your personal link for editing your
                    series. Please follow the link to:
                    <br />
                    <ol>
                        <li className="about-list-item">
                            Check if the preview is rendered correctly. Below
                            the form you should see a preview render of your
                            project.
                        </li>
                        <li className="about-list-item">
                            Use the series validation tool linked below the form
                            the validate if your series creates consistent
                            outputs.
                        </li>

                        <li className="about-list-item">
                            Make changes to your submission in the future.
                            Please save the link for this.
                        </li>
                    </ol>
                </p>
                <p>
                    <a href={seriesLink}>{seriesLink}</a>
                </p>
            </div>
        );
    }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error && (
                    <div style={{ color: "red", marginBottom: "1rem" }}>
                        {error}
                    </div>
                )}

                <div className="form-element">
                    <label>Artist Name:</label>
                    <input
                        type="text"
                        name="artistName"
                        value={formData.artistName}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-element">
                    <label>Artist Address:</label>
                    <input
                        type="text"
                        name="artistAddress"
                        value={formData.artistAddress}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                {!showTestnetAddress && (
                    <a
                        style={{
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            setShowTestnetAddress(!showTestnetAddress)
                        }
                    >
                        I have a different address on testnet
                    </a>
                )}
                {showTestnetAddress && (
                    <div className="form-element">
                        <label>Artist Address Testnet:</label>
                        <input
                            type="text"
                            name="artistAddressTestnet"
                            value={formData.artistAddressTestnet}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                )}

                <div className="form-element">
                    <label>Series Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-element">
                    <label>Description:</label>
                    <textarea
                        rows="15"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    ></textarea>
                </div>

                {/* <div className="form-element">
                    <label>Planned Release (YYYY-MM-DD HH:MM):</label>
                    <input
                        type="text"
                        name="plannedRelease"
                        value={formData.plannedRelease}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div> */}

                <div className="form-element">
                    <label>Number of Tokens:</label>
                    <input
                        type="number"
                        name="numEditions"
                        value={formData.numEditions}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-element">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.001"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-element">
                    <label>ZIP File:</label>
                    <input
                        type="file"
                        name="zipfile"
                        accept=".zip"
                        onChange={handleChange}
                        className="form-control"
                    />

                    <p>{isUpdate && <span>(Optional for updates)</span>}</p>
                </div>

                <button type="submit" className="btn btn-default">
                    {isUpdate ? "Update Series" : "Create Series"}
                </button>
            </form>
            <br />
            <br />
            <br />
            {plannedRelease !== "" && (
                <div>
                    <h1>Planned Release</h1>
                    <p>{plannedRelease}</p>
                </div>
            )}

            {testnetContract && (
                <div
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginTop: "20px",
                        width: "500px",
                    }}
                >
                    <h1>You are live on Testnet</h1>
                    <a
                        href={`${APP_URL}artist-docs#testing-on-testnet`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Instructions
                    </a>
                    <br />
                    <br />
                    <a
                        href={`https://testnet.editart.xyz/series/${testnetContract}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open Testnet Series
                    </a>
                    <br />
                    <a
                        href={`https://testnet.editart.xyz/artist-panel/${testnetContract}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open Artist Panel
                    </a>
                </div>
            )}
            <br />
            {testDirKey && (
                <>
                    {" "}
                    <h1>Series Validation</h1>
                    Use{" "}
                    <a
                        href={`${APP_URL}series-validation/${
                            testDirKey.split("/")[1]
                        }`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        this tool
                    </a>{" "}
                    tool to check if your series produces consistent outputs.
                </>
            )}

            {testDirKey && (
                <>
                    <br />
                    <br /> Make sure that the Grid view works:{" "}
                    <Link
                        to={`https://grid.editart.xyz/grid/${testDirKey.split("project_tests/")[1]}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Grid View
                    </Link>
                    <br />
                    <br />
                </>
            )}
            {previewKeys && (
                <>
                    {" "}
                    <br />
                    <br />
                    <h1>Test Previews</h1>
                    <p>
                        Please make sure that the test previews match the
                        sketch. You can find help in the{" "}
                        <a
                            href={`${APP_URL}artist-docs#troubleshooting`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            troubleshooting section
                        </a>
                        .
                    </p>
                    {previewKeys.map((previewKey, idx) => (
                        <div key={idx}>
                            <p>
                                <b>
                                    {previewKey.query_string
                                        .split("?")[1]
                                        .replaceAll("&", " ")}
                                </b>
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    marginBottom: "50px",
                                }}
                            >
                                <div
                                    style={{
                                        marginRight: "20px",
                                    }}
                                >
                                    <p>Live View</p>
                                    <ReloadIframe
                                        idx={idx}
                                        url={`https://editart-1.fra1.cdn.digitaloceanspaces.com/${testDirKey}/index.html${previewKey.query_string}`}
                                    />
                                </div>
                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >
                                    <p>Preview Image</p>
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: -1,
                                        }}
                                    >
                                        Preview Loading...
                                    </div>
                                    <img
                                        className="standard-width standard-height"
                                        src={`https://editart-1.fra1.cdn.digitaloceanspaces.com/${previewKey.key}`}
                                        style={{
                                            objectFit: "contain",
                                            objectPosition: "center",
                                            display: "block",
                                        }}
                                        onLoad={(e) =>
                                            (e.target.style.opacity = 1)
                                        }
                                        onError={(e) =>
                                            (e.target.style.display = "none")
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {testDirKey && (
                <>
                    <a
                        href={`https://editart-1.fra1.cdn.digitaloceanspaces.com/${testDirKey}/index.html`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open Sketch
                    </a>
                    <br />
                    <br />
                </>
            )}

            {/* {previewKeys && !testnetContract && (
                <>
                    <p>
                        If you get consistent outputs, the grid view works and
                        the previews render properly, you can deploy to testnet
                    </p>
                    <button
                        type="submit"
                        className="btn btn-default"
                        onClick={handleDeployTestnet}
                    >
                        Deploy to Testnet
                    </button>
                </>
            )} */}
        </>
    );
}

export default SeriesSubmissionForm;
