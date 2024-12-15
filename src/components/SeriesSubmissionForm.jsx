import React, { useEffect, useState } from "react";
import { APP_URL, BACKEND_URL } from "../consts";

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
                    const year = dt
                        .getUTCFullYear()
                        .toString()
                        .padStart(4, "0");
                    const month = (dt.getUTCMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                    const day = dt.getUTCDate().toString().padStart(2, "0");
                    const hours = dt.getUTCHours().toString().padStart(2, "0");
                    const mins = dt.getUTCMinutes().toString().padStart(2, "0");
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
            form.append("plannedRelease", formData.plannedRelease);
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
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <div>
                <label>Artist Name:</label>
                <input
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Artist Address:</label>
                <input
                    type="text"
                    name="artistAddress"
                    value={formData.artistAddress}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Series Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div>
                <label>Planned Release (YYYY-MM-DD HH:MM):</label>
                <input
                    type="text"
                    name="plannedRelease"
                    value={formData.plannedRelease}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Number of Tokens:</label>
                <input
                    type="number"
                    name="numEditions"
                    value={formData.numEditions}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Price:</label>
                <input
                    type="number"
                    step="0.001"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>ZIP File:</label>
                <input
                    type="file"
                    name="zipfile"
                    accept=".zip"
                    onChange={handleChange}
                />
                {isUpdate && <p>(Optional for updates)</p>}
            </div>

            <button type="submit">
                {isUpdate ? "Update Series" : "Create Series"}
            </button>
        </form>
    );
}

export default SeriesSubmissionForm;
