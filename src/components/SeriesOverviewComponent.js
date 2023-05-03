import SeriesBox from "./SeriesBox";
import { useState } from "react";
import LoadMoreButton from "./LoadMoreButton";
import { useContext } from "react";
import { SeriesContext } from "../App";
import { ENV } from "../consts";

function SeriesOverviewComponent() {
    let series = useContext(SeriesContext);
    if(ENV !== 'prod') series = [];
    const pageLength = 9;

    const [page, setPage] = useState(pageLength);
    const loadMore = () => {
        if (page < series.length) setPage(Math.max(page + pageLength, 0));
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "left",
                    flexWrap: "wrap",
                }}
            >
                {series.slice(0, page).map((c) => (
                    <SeriesBox
                        contract={c.contract}
                        author={c.artistName}
                        key={c.contract}
                        name={c.name}
                    />
                ))}
            </div>
            {page <= series.length && <LoadMoreButton loadMore={loadMore} />}
        </div>
    );
}

export default SeriesOverviewComponent;
