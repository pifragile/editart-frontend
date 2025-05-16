import SeriesBox from "./SeriesBox";
import { useEffect, useState } from "react";
import LoadMoreButton from "./LoadMoreButton";
import { useContext } from "react";
import { SeriesContext } from "../App";
import { ENV } from "../consts";

function SeriesOverviewComponent({ seriesFilter = null, showSearch = false }) {
    let series = useContext(SeriesContext);
    const pageLength = 9;

    const [page, setPage] = useState(pageLength);
    const [selectedSeries, setSelectedSeries] = useState([]);

    const loadMore = () => {
        if (page < selectedSeries.length)
            setPage(Math.max(page + pageLength, 0));
    };
    useEffect(() => {
        console.log(series);
        let filtereSeries = series.filter(
            (e) => e.contractData.tokensCount > 0
        );

        if (seriesFilter) {
            filtereSeries = filtereSeries.filter((s) => seriesFilter(s));
        }

        if (ENV !== "prod") filtereSeries = [];
        setSelectedSeries(filtereSeries);
    }, [series]);

    return (
        <>
            {selectedSeries.length > -1 && (
                <div>
                    {showSearch && (
                        <div
                            style={{
                                width: "min(400px, 80vw)",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search series..."
                                onChange={(e) => {
                                    const searchTerm =
                                        e.target.value.toLowerCase();
                                    setSelectedSeries(
                                        series.filter(
                                            (s) =>
                                                s.artistName
                                                    .toLowerCase()
                                                    .includes(searchTerm) ||
                                                s.name
                                                    .toLowerCase()
                                                    .includes(searchTerm)
                                        )
                                    );
                                }}
                                style={{
                                    marginBottom: "3px",
                                    boxSizing: "border-box",
                                    width: "100%",
                                    padding: "4px",
                                }}
                            />

                            <table
                                style={{ width: "100%", margin: "2px 0 0 0" }}
                            >
                                <tbody>
                                    <tr className="no-border">
                                        <td className="no-border">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        const checked =
                                                            e.target.checked;
                                                        let targetSeries =
                                                            checked
                                                                ? selectedSeries
                                                                : series;
                                                        setSelectedSeries(
                                                            targetSeries.filter(
                                                                (s) =>
                                                                    checked
                                                                        ? s
                                                                              .contractData
                                                                              .storage
                                                                              .num_tokens ===
                                                                          s
                                                                              .contractData
                                                                              .storage
                                                                              .last_token_id
                                                                        : true
                                                            )
                                                        );
                                                    }}
                                                />
                                                Sold Out
                                            </label>
                                        </td>
                                        <td className="no-border">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        const checked =
                                                            e.target.checked;
                                                        let targetSeries =
                                                            checked
                                                                ? selectedSeries
                                                                : series;
                                                        setSelectedSeries(
                                                            targetSeries.filter(
                                                                (s) =>
                                                                    checked
                                                                        ? s
                                                                              .contractData
                                                                              .storage
                                                                              .num_tokens !==
                                                                          s
                                                                              .contractData
                                                                              .storage
                                                                              .last_token_id
                                                                        : true
                                                            )
                                                        );
                                                    }}
                                                />
                                                Still Minting
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "left",
                            flexWrap: "wrap",
                        }}
                    >
                        {selectedSeries.slice(0, page).map((c) => (
                            <SeriesBox
                                contract={c.contract}
                                author={c.artistName}
                                key={c.contract}
                                //name={c.genuary2025 ? `Genuary ${c.genuary2025}: ${c.name}` : c.name}
                                name={c.name}
                            />
                        ))}
                    </div>
                    {page <= selectedSeries.length && (
                        <LoadMoreButton loadMore={loadMore} />
                    )}
                </div>
            )}
        </>
    );
}

export default SeriesOverviewComponent;
