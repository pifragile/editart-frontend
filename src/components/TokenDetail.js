import { Link, useParams } from "react-router-dom";

import Layout from "./Layout";
import TokenActionForm from "./TokenActionForm";

import { useEffect, useState } from "react";

import {
    getContractBigmap,
    getContractMetadata,
    getContractStorage,
    getToken,
} from "../lib/api";
import UserDetail from "./UserDetail";
import TokenImage from "./TokenImage";
import { getTokenMetadata } from "../lib/api";
import { resolveIpfs } from "../lib/utils";
import { useContext } from "react";
import { SeriesContext } from "../App";

function TokenDetail() {
    const series = useContext(SeriesContext);
    let { contract, tokenId } = useParams();
    const [tokenPrice, setTokenPrice] = useState(null);
    const [owner, setOwner] = useState(null);
    const [token, setToken] = useState(null);
    const [artist, setArtist] = useState(null);
    const [creator, setCreator] = useState(null);
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            let token = await getToken(contract, tokenId);
            token.metadata = await getTokenMetadata(
                token.contract.address,
                token.tokenId
            );
            setToken(token);
            setArtist(await getContractStorage(contract, "artist_address"));
            setTokenPrice(
                await getContractBigmap(contract, "listings", tokenId)
            );
            setOwner(await getContractBigmap(contract, "ledger", tokenId));
            setCreator(await getContractBigmap(contract, "creators", tokenId));
            setMetadata(await getContractMetadata(contract));
        };

        fetchToken().catch(console.error);
    }, [tokenId, contract]);

    if (token && metadata) {
        return (
            <Layout>
                <h1>{token.metadata.name}</h1>
                <div>
                    <div title="token" style={{ paddingBottom: "1em" }}>
                        <TokenImage
                            url={token.metadata.artifactUri}
                            displayUrl={token.metadata.displayUri}
                            isBig={true}
                            showArtifact={series.find(e => e.contract === contract)?.displayArtifact || false}
                        />
                    </div>

                    <div
                        className="standard-width"
                        style={{
                            border: "None",
                            marginTop: "1vh",
                        }}
                    >
                        <div>
                            <b>Artist:</b>
                            <UserDetail address={artist} isLink={true} />
                        </div>
                        <div>
                            <b>Owner:</b>
                            <UserDetail address={owner} isLink={true} />
                        </div>

                        <div>
                            <b>Co-Creator:</b>
                            <UserDetail address={creator} isLink={true} />
                        </div>
                    </div>
                    <br />
                    <a
                        href={resolveIpfs(token.metadata.artifactUri)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button class="btn btn-default">Open live view</button>
                    </a>
                    <br />
                    <Link to={`/series/${contract}`}>
                        <button class="btn btn-default">Go to series</button>
                    </Link>
                    {/* <br />
                    <a
                        href={resolveIpfs(token.metadata.artifactUri)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button class="btn btn-default">Add to DIY Frame</button>
                    </a> */}
                    <br />
                    <div
                        className="token-detail-width"
                        style={{ marginTop: "1vh" }}
                    >
                        <TokenActionForm
                            price={tokenPrice}
                            contract={contract}
                            tokenId={tokenId}
                            owner={owner}
                        />
                    </div>
                </div>
            </Layout>
        );
    } else {
        <Layout>return "Loading..";</Layout>;
    }
}

export default TokenDetail;
