import TokenBox from "./TokenBox";
import LoadMoreButton from "./LoadMoreButton";

function TokenGrid({ tokens, loadMore }) {
    return (
        <div>
            {tokens.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {tokens.map((token) => {
                        if (token.metadata)
                            return (
                                <TokenBox
                                    id={token.tokenId}
                                    contract={token.contract.address}
                                    title={token.metadata.name}
                                    artifactUri={token.metadata.artifactUri}
                                    displayUri={token.metadata.displayUri}
                                    key={token.metadata.name}
                                    price={token.price}
                                    creator={token.creator}
                                />
                            );
                        return "";
                    })}
                </div>
            )}
            {tokens.length === 0 && (
                <div style={{ marginTop: "5vw" }}>No tokens found..</div>
            )}
            <LoadMoreButton loadMore={loadMore} />
        </div>
    );
}

export default TokenGrid;
