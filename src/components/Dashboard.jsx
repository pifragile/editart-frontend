import { useEffect, useState } from "react";
import { getContractStorageFull, listContractBigmap } from "../lib/api";
import { useContext } from "react";
import { SeriesContext } from "../App";

function Dashboard() {
    const series = useContext(SeriesContext);
    const [numSeries, setNumSeries] = useState(series.length);
    const [numArtists, setNumArtists] = useState(0);
    const [numCocreators, setNumCocreators] = useState(0);
    const [numTokensSold, setNUmTokensSold] = useState(0);
    const [primaryVolume, setPrimaryVolume] = useState(0);

    useEffect(() => {
        async function action() {
            setNumSeries(series.length);
            const contracts = series.map((e) => e.contract);

            const contractStorages = await Promise.all(
                contracts.map(async (a, idx) => {
                    await new Promise((r) => setTimeout(r, 100 * idx));
                    return await getContractStorageFull(a);
                })
            );

            setNumArtists(
                new Set(contractStorages.map((e) => e.artist_address)).size
            );

            const creators = await Promise.all(
                contracts.map(async (a, idx) => {
                    await new Promise((r) => setTimeout(r, 100 * idx));
                    return (await listContractBigmap(a, "creators")).map(
                        (e) => e.value
                    );
                })
            );

            setNumCocreators(new Set(creators.flat()).size);
            setNUmTokensSold(
                contractStorages.reduce(
                    (a, c) => a + parseInt(c["last_token_id"]),
                    0
                )
            );
            setPrimaryVolume(
                contractStorages.reduce(
                    (a, c) =>
                        a +
                        (parseInt(c["last_token_id"]) * parseInt(c.price)) /
                            1000000,
                    0
                )
            );
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
