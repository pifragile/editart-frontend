import Layout from "./Layout";
import SeriesOverviewComponent from "./SeriesOverviewComponent";

function SeriesOverview() {
    return (
        <Layout>
            <SeriesOverviewComponent showSearch={true}/>
        </Layout>
    );
}

export default SeriesOverview;
