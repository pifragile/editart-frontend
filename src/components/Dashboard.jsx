import { useEffect, useState } from "react";
import { getContractStorageFull, listContractBigmap } from "../lib/api";
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
            if (!series) return
            setNumSeries(series.length);
            const contracts = series.map((e) => e.contract)
            if(contracts.length ===0) return
            setNumArtists(
                new Set(series.map((e) => e.artistAddress)).size
            );


            

            let query = `v1/contracts?address.in=${contracts.join(',')}&includeStorage=true`;
            let res = await fetch(TZKT_API + query);
            let contractData = await res.json();


            setNUmTokensSold(
                contractData.reduce(
                    (a, c) => a + parseInt(c.storage["last_token_id"]),
                    0
                )
            );
            setPrimaryVolume(
                contractData.reduce(
                    (a, c) =>
                        a +
                        (parseInt(c.storage["last_token_id"]) * parseInt(c.storage.price)) /
                            1000000,
                    0
                )
            );


            const creatorsBigMapKeys = contractData.map(c => c.storage.creators)
            query = `v1/bigmaps/keys?bigmap.in=${creatorsBigMapKeys.join(',')}&limit=10000&active=true`;
            res = await fetch(TZKT_API + query);
            let creators = await res.json();
            creators = creators.map(c => c.value)
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
