import React, { useEffect, useState } from "react";
import { APP_URL, BACKEND_URL } from "../consts";

function localToUTCString(localDateStr) {
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
        name: "",
        description: "",
        plannedRelease: "", // "YYYY-MM-DD HH:MM" format
        numEditions: "",
        price: "",
        zipfile: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(!!seriesId);
    const [createdId, setCreatedId] = useState(null);
    const [previewKey, setPreviewKey] = useState(null);
    const [testDirKey, setTestDirKey] = useState(null);

    useEffect(() => {
        if (!seriesId) return; // If no seriesId, no need to fetch

        const fetchData = async () => {
            try {
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
                    const month = (dt.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                    const day = dt.getDate().toString().padStart(2, "0");
                    const hours = dt.getHours().toString().padStart(2, "0");
                    const mins = dt.getMinutes().toString().padStart(2, "0");

                    var formattedRelease = `${year}-${month}-${day} ${hours}:${mins}`;
                } else {
                    var formattedRelease = "";
                }

                setFormData({
                    artistName: data.artistName || "",
                    artistAddress: data.artistAddress || "",
                    name: data.name || "",
                    description: data.description || "",
                    plannedRelease: formattedRelease,
                    numEditions: data.numEditions
                        ? data.numEditions.toString()
                        : "",
                    price: data.price ? data.price.toString() : "",
                    zipfile: null, // never prefilled
                });
                setPreviewKey(data.previewKey);
                setTestDirKey(data.testDirKey);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

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

        // Validate required fields for creation
        if (!isUpdate) {
            const requiredFields = [
                "artistName",
                "artistAddress",
                "name",
                "description",
                "plannedRelease",
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

        setLoading(true);

        try {
            const form = new FormData();
            form.append("artistName", formData.artistName);
            form.append("artistAddress", formData.artistAddress);
            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append(
                "plannedRelease",
                localToUTCString(formData.plannedRelease)
            );
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
            setLoading(false);
        }
    };

    if (createdId) {
        const seriesLink = `${APP_URL}series-submission/${createdId}`;
        return (
            <div>
                <p> Your series was submitted!</p>
                <br></br>
                <p>
                    Please save the following link and use it to edit the series
                    in the future:
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

                <div className="form-element">
                    <label>Planned Release (YYYY-MM-DD HH:MM):</label>
                    <input
                        type="text"
                        name="plannedRelease"
                        value={formData.plannedRelease}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

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
            <br/>
            {testDirKey && (
                <>
                    {" "}
                    <h1>Series Validation</h1>
                    Use{" "}
                    <a
                        href={`${APP_URL}series-validation/${testDirKey.split("/")[1]}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        this tool
                    </a>{" "}
                    tool to check if your series produces consistent outputs.
                </>
            )}

            {previewKey && (
                <>
                    {" "}
                    <h1>Test Preview (Beta)</h1>
                    <img
                        className="standard-width standard-height"
                        src={`https://editart.fra1.cdn.digitaloceanspaces.com/${previewKey}`}
                    />
                </>
            )}
        </>
    );
}

export default SeriesSubmissionForm;
