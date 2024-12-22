import { useEffect, useState } from "react";
import {
    fetchAllContractData,
    getContractStorageFull,
    listContractBigmap,
} from "../lib/api";
import { useContext } from "react";
import { SeriesContext } from "../App";
import { TZKT_API } from "../consts";

function Dashboard() {
    const series = useContext(SeriesContext);
    const [numSeries, setNumSeries] = useState(series.length);
    const [numArtists, setNumArtists] = useState(0);
    const [numCocreators, setNumCocreators] = useState(0);
    const [numTokensSold, setNUmTokensSold] = useState(0);
    const [primaryVolume, setPrimaryVolume] = useState(0);

    useEffect(() => {
        async function action() {
            if (series.length === 0) return;
            setNumSeries(series.length);

            setNumArtists(new Set(series.map((e) => e.artistAddress)).size);

            setNUmTokensSold(
                series.reduce(
                    (a, s) =>
                        a + parseInt(s.contractData.storage["last_token_id"]),
                    0
                )
            );
            setPrimaryVolume(
                series.reduce(
                    (a, s) =>
                        a +
                        (parseInt(s.contractData.storage["last_token_id"]) *
                            parseInt(s.contractData.storage.price)) /
                            1000000,
                    0
                )
            );

            const creators = series.map((s) =>
                Object.values(s.contractData.storage.creators).map(
                    (e) => e.value
                )
            );
            setNumCocreators(new Set(creators.flat()).size);
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
                            Artworks sold
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
