import Layout from "./Layout";
import SeriesBox from "./SeriesBox";
import contracts from "../contracts";
import { Link } from "react-router-dom";
import TwitterFeed from "./TwitterFeed";
import Dashboard from "./Dashboard";
function Home() {
    return (
        <Layout>
            <div className="main">
                <span>
                    <b>EditArt</b> is a generative art platform on Tezos, where
                    collectors can become creators by co-creating a piece of art
                    with the artist.
                </span>
                <br />
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

                <div>❤️ , pifragile</div>
                {/* <TokenOverview query={query}></TokenOverview> */}
            </div>
            <Dashboard />
            <div style={{ marginTop: "5vh" }}>
                <h1>Series</h1>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "left",
                        flexWrap: "wrap",
                    }}
                >
                    {contracts.map((c) => (
                        <SeriesBox
                            contract={c.address}
                            author={c.author}
                            key={c.address}
                            name={c.name}
                        />
                    ))}
                </div>
            </div>
            <div style={{ marginTop: "5vh" }}>
                <h1>EditArt on Twitter</h1>
                <TwitterFeed />
            </div>
        </Layout>
    );
}

export default Home;
