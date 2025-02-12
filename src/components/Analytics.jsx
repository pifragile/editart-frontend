import Layout from "./Layout";
import { getAnalytics } from "../lib/analyticsData";
import { useEffect } from "react";

function Analytics() {
    useEffect(() => {
        async function action() {
            await getAnalytics();
        }
        action();
    }, []);
    return <Layout></Layout>;
}

export default Analytics;