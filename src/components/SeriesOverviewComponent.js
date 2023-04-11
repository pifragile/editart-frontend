import SeriesBox from "./SeriesBox";
import contracts from "../contracts";
import { useState } from "react";
import LoadMoreButton from "./LoadMoreButton";

function SeriesOverviewComponent() {
    const pageLength = 20;

    const [page, setPage] = useState(pageLength);
    const loadMore = () => {
        if (page < contracts.length) setPage(Math.max(page + pageLength, 0));
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
                {contracts.slice(0, page).map((c) => (
                    <SeriesBox
                        contract={c.address}
                        author={c.author}
                        key={c.address}
                        name={c.name}
                    />
                ))}
            </div>
            {page <= contracts.length && <LoadMoreButton loadMore={loadMore} />}
        </div>
    );
}

export default SeriesOverviewComponent;
