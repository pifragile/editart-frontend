import Layout from "./Layout";
import TokenOverview from "./TokenOverview";
import { extractTokensForOverview } from "../lib/utils";

import { useParams } from "react-router-dom";

import UserDetail from "./UserDetail";
import { SeriesContext } from "../App";
import { useContext, useEffect, useState } from "react";
import SeriesOverviewComponent from "./SeriesOverviewComponent";
function User() {
    const [query, setQuery] = useState(null);
    const [filter, setFilter] = useState(null);
    const series = useContext(SeriesContext);
    let { address } = useParams();

    useEffect(() => {
        if (address && series.length > 0) {
            let q =
                "v1/tokens/balances" +
                "?" +
                new URLSearchParams({
                    "token.contract.in": series
                        .map((c) => c.contract)
                        .join(","),
                    account: address,
                    "balance.gt": 0,
                    "sort.desc": "firstTime",
                });
            if (filter) {
                q +=
                    "&" +
                    new URLSearchParams({
                        "token.metadata.name.as": `*${filter}*`,
                    });
            }
            setQuery(q);
        }
    }, [series, address, filter]);

    if (address !== "null") {
        const [inputValue, setInputValue] = useState("");

        return (
            <Layout>
            <UserDetail address={address} />
            <h1>Creations</h1>
            <SeriesOverviewComponent
                seriesFilter={(s) => s.artistAddress === address}
            ></SeriesOverviewComponent>
            <h1>Collection</h1>
            <div
                style={{
                width: "min(400px, 80vw)",
                display: "flex",
                gap: "6px",
                marginBottom: "3px",
                }}
            >
                <input
                type="text"
                placeholder="Search tokens..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                    boxSizing: "border-box",
                    width: "100%",
                    padding: "4px",
                }}
                />
                <button
                className="btn btn-default"
                onClick={() => setFilter(inputValue.toLowerCase())}
                >
                Search
                </button>
            </div>
            <TokenOverview
                query={query}
                pageLength={6}
                extractTokens={extractTokensForOverview}
                key={query}
            ></TokenOverview>
            </Layout>
        );
    } else {
        return <Layout>Please sync your wallet.</Layout>;
    }
}

export default User;
