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
            setQuery(q);
        }
    }, [series, address]);

    if (address) {
        return (
            <Layout>
                <UserDetail address={address} />
                <h1>Creations</h1>
                <SeriesOverviewComponent
                    artistAddress={address}
                ></SeriesOverviewComponent>
                <h1>Collection</h1>
                <TokenOverview
                    query={query}
                    pageLength={6}
                    extractTokens={extractTokensForOverview}
                ></TokenOverview>
            </Layout>
        );
    } else {
        return <Layout>Please sync your wallet.</Layout>;
    }
}

export default User;
