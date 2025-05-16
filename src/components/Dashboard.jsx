import { useEffect, useState } from "react";
import { useContext } from "react";
import { SeriesContext } from "../App";
import { BACKEND_URL } from "../consts";

function Dashboard() {
    let series = useContext(SeriesContext);
    const [numSeries, setNumSeries] = useState(series.length);
    const [numArtists, setNumArtists] = useState(0);
    const [numCocreators, setNumCocreators] = useState(0);
    const [numTokensSold, setNUmTokensSold] = useState(0);
    const [primaryVolume, setPrimaryVolume] = useState(0);

    useEffect(() => {
        async function action() {
            const response = await fetch(`${BACKEND_URL}stats`);
            const stats = await response.json();

            setNumSeries(stats.numSeries);
            setNumArtists(stats.numArtists);
            setNumCocreators(stats.numCocreators);
            setNUmTokensSold(stats.numTokensSold);
            setPrimaryVolume(stats.primaryVolume);
        }

        action().catch(console.error);
    }, [series]);

    return (
        <div style={{ marginTop: "5vh", width: "min(600px, 80vw)" }}>
            <h1>EditArt in numbers</h1>
            <table>
                {/* <caption>EditArt in numbers</caption> */}
                <tbody>
                    <tr>
                        <td style={{ color: "inherit", fontWeight: "inherit" }}>
                            Series
                        </td>
                        <td>{numSeries}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "inherit", fontWeight: "inherit" }}>
                            Artists
                        </td>
                        <td>{numArtists || <div className="spinner"></div>}</td>
                    </tr>
                    <tr>
                        <td style={{ color: "inherit", fontWeight: "inherit" }}>
                            Co-creators
                        </td>
                        <td>
                            {numCocreators || <div className="spinner"></div>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ color: "inherit", fontWeight: "inherit" }}>
                            Artworks collected
                        </td>
                        <td>
                            {numTokensSold || <div className="spinner"></div>}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ color: "inherit", fontWeight: "inherit" }}>
                            Primary volume (tez)
                        </td>
                        <td>
                            {primaryVolume || <div className="spinner"></div>}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
