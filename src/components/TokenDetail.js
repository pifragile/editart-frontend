import { useParams } from "react-router-dom";

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

function TokenDetail() {
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
                    <div
                        title="token"
                        style={{
                            border: "None",
                            height: "min(400px, 80vw)",
                            width: "min(400px, 80vw)",
                        }}
                    >
                        <TokenImage
                            url={token.metadata.artifactUri}
                            displayUrl={token.metadata.displayUri}
                        />
                    </div>

                    <div
                        style={{
                            border: "None",
                            width: "min(400px, 80vw)",
                            marginTop: "1vh",
                        }}
                    >
                        <div>
                            <b>Artist:</b>
                            <UserDetail address={artist} isLink={true} />
                        </div>
                        <div>
                            <b>Owner:</b>
                            <UserDetail address={owner} isLink={true}/>
                        </div>

                        <div>
                            <b>Creator:</b>
                            <UserDetail address={creator} isLink={true}/>
                        </div>
                    </div>
                    <div
                        style={{ width: "min(400px, 80vw)", marginTop: "1vh" }}
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
