import Layout from "./Layout";
import SeriesBox from "./SeriesBox";
import contracts from "../contracts";
function Home() {
    return (
        <Layout>
            <div className="main">
                <h1>EditART...</h1>

                <ul>
                    <li>
                        is a generative art platform, where collectors can
                        become creators by co-creating a piece of art with the
                        artist.
                    </li>
                    <li>is currently running in Beta mode!</li>
                    <li>
                        is happy to release projects by many artists, please
                        reach out.
                    </li>
                    <li>
                        is a project by generative artist{" "}
                        <a href="https://twitter.com/pifragile/" target="_blank" rel="noreferrer"> pifragile</a>
                    </li>
                    <li>
                        has a twitter page {" "}
                        <a href="https://twitter.com/editart_xyz" target="_blank" rel="noreferrer"> @editart_xyz</a>
                    </li>
                </ul>
                <div>
                    For infos{" "}
                    <a href="https://twitter.com/pifragile/" target="_blank" rel="noreferrer">
                        {" "}
                        DM me on twitter
                    </a>
                </div>

                <div>❤️ , pifragile</div>
                {/* <TokenOverview query={query}></TokenOverview> */}
            </div>
            <div style={{ marginTop: "5vh" }}>
                <h1>Featured Series</h1>
                <SeriesBox
                    contract={contracts[0].address}
                    author={contracts[0].author}
                />
            </div>
        </Layout>
    );
}

export default Home;
