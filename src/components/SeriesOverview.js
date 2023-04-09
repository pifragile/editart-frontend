import Layout from "./Layout";
import SeriesBox from "./SeriesBox";
import contracts from "../contracts";

function SeriesOverview() {
    return (
        <Layout>
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
        </Layout>
    );
}

export default SeriesOverview;
