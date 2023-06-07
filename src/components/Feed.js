import { useContext, useEffect, useState } from "react";
import { SeriesContext } from "../App";
import { getFeed } from "../lib/api";
import { formatMutez } from "../lib/utils";
import { Link } from "react-router-dom";
import UserDetail from "./UserDetail";
import LoadMoreButton from "./LoadMoreButton";
import Layout from "./Layout";
function Feed() {
    const series = useContext(SeriesContext);
    const [feedData, setFeedData] = useState([]);

    const pageLength = 10;
    const [page, setPage] = useState(0);
    const [maybeMore, setMaybeMore] = useState(true);

    const loadMore = () => {
        setPage(Math.max(page + pageLength, 0));
    };

    useEffect(() => {
        if (series.length > 0) {
            async function action() {
                if (maybeMore) {
                    const result = await getFeed(series, pageLength, page);
                    if (result.length > 0) {
                        setFeedData(f => f.concat(result));
                        setMaybeMore(result.length === pageLength);
                    } else {
                        setPage(Math.max(page - pageLength, 0));
                    }
                }
            }
            action().catch(console.error);
        }
    }, [series, page, maybeMore]);

    if (feedData.length > 0) {
        return (
            <Layout>
                <h1>Activity Feed</h1>
                {feedData.map((e) => (
                    <p key={e.timestamp}>
                        {new Date(e.timestamp).toLocaleString()} |{" "}
                        <UserDetail address={e.sender} isLink={true} /> {e.verb}{" "}
                        <Link to={`/token-detail/${e.contract}/${e.tokenId}`}>
                            {e.collectionName} {e.tokenId}
                        </Link>{" "}
                        for {formatMutez(e.price)}
                    </p>
                ))}
                <LoadMoreButton loadMore={loadMore} />
            </Layout>
        );
    }
}

export default Feed;
