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
import { resolveIpfs, resolveIpfsGatewaySketches } from "../lib/utils";
import { useContext } from "react";
import { SeriesContext } from "../App";
import { WalletContext } from "../lib/wallet";

function TokenDetail() {
    const wallet = useContext(WalletContext);
    const series = useContext(SeriesContext);
    let { contract, tokenId } = useParams();
    const [tokenPrice, setTokenPrice] = useState(null);
    const [owner, setOwner] = useState(null);
    const [token, setToken] = useState(null);
    const [artist, setArtist] = useState(null);
    const [creator, setCreator] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [activeAccount, setActiveAccount] = useState(null);

    useEffect(() => {
        const func = async () => {
            const account = await wallet.client.getActiveAccount();
            if (account) {
                setActiveAccount(account.address);
            }
        };
        func();
    }, [wallet]);

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
            <div>
                <div className="editor-container">
                <div className="editor-iframe-container">
                    <TokenImage
                    url={token.metadata.artifactUri}
                    displayUrl={token.metadata.displayUri}
                    isBig={true}
                    showArtifact={
                        series.find((e) => e.contract === contract)
                        ?.displayArtifact || false
                    }
                    />
                </div>
                <div className="editor-mint-form-container">
                    <table style={{ padding: "0px", margin: "0px" }}>
                    <tr className="no-border">
                        <td className="no-border">
                        <b>{token.metadata.name}</b>
                        </td>
                        <td className="no-border">by </td>
                        <td className="no-border">
                        {" "}
                        <UserDetail
                            address={artist}
                            isLink={true}
                        />
                        </td>
                    </tr>
                    <tr className="no-border">
                        <td className="no-border">
                        {" "}
                        <span>
                            {new Date(
                            token.firstTime
                            ).toLocaleString([], {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            })}
                        </span>
                        </td>
                        <td className="no-border">creator</td>
                        <td className="no-border">
                        {" "}
                        <UserDetail
                            address={creator}
                            isLink={true}
                        />
                        </td>
                    </tr>
                    <tr className="no-border">
                        <td className="no-border"> </td>
                        <td className="no-border">owner </td>
                        <td className="no-border">
                        {" "}
                        <UserDetail
                            address={owner}
                            isLink={true}
                        />
                        </td>
                    </tr>
                    </table>
                    <br />
                    <br />
                    <a
                    href={resolveIpfsGatewaySketches(
                        token.metadata.artifactUri
                    )}
                    target="_blank"
                    rel="noreferrer"
                    >
                    <button className="btn btn-default">
                        Open live view
                    </button>
                    </a>
                    <br />
                    <Link to={`/series/${contract}`}>
                    <button className="btn btn-default">
                        Go to series
                    </button>
                    </Link>

                    <br />
                    {activeAccount === owner &&
                    series.find((s) => s.contract === contract)
                        ?.enablePrint && (
                        <a
                        href={`https://prints.pifragile.com/?url=${encodeURIComponent(
                            resolveIpfsGatewaySketches(
                            token.metadata.artifactUri
                            )
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        >
                        <button className="btn btn-default">
                            Order Print
                        </button>
                        </a>
                    )}
                    <TokenActionForm
                    price={tokenPrice}
                    contract={contract}
                    tokenId={tokenId}
                    owner={owner}
                    />
                </div>
                </div>
            </div>
            </Layout>
        );
    } else {
        <Layout>return "Loading..";</Layout>;
    }
}

export default TokenDetail;
