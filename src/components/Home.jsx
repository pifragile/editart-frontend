import Layout from "./Layout";
import { Link } from "react-router-dom";
import TwitterFeed from "./TwitterFeed";
import Dashboard from "./Dashboard";
import SeriesOverviewComponent from "./SeriesOverviewComponent";
function Home() {
    return (
        <Layout>
            <div className="main">
                <span style={{ marginTop: "5vh" }}>
                    Welcome to <b>EditArt</b>! Co-create a piece of generative
                    art using 5 sliders.
                </span>
                {/* <br />
                <br />
                <p>
                    &gt; Infos for artists <Link to={`/about`}>here</Link>
                </p>

                <div>
                    For infos{" "}
                    <a
                        href="https://twitter.com/pifragile/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {" "}
                        DM me on twitter
                    </a>
                </div>

                <div>❤️ , Piero</div>
                <TokenOverview query={query}></TokenOverview> */}
            </div>
            <div style={{ marginTop: "5vh" }}>
                <h1>Featured Series</h1>
                <SeriesOverviewComponent seriesFilter={(s) => s.featured} />
            </div>

            <Dashboard />

            {/* <div style={{ marginTop: "5vh" }}>
                <h1>Series</h1>
                <SeriesOverviewComponent />
            </div> */}
            <div style={{ marginTop: "5vh" }}>
                <h1>EditArt on X</h1>
                <TwitterFeed />
            </div>
        </Layout>
    );
}

export default Home;
