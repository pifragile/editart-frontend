import { IPFS_UPLOADER_GATEWAY } from "../consts";
import { resolveIpfs, resolveIpfsCdn } from "../lib/utils";
import LiveViewIFrame from "./LiveViewIFrame";
function TokenImage({ displayUrl, url, isBig, showArtifact }) {
    const displayArtifact = showArtifact || !displayUrl
    return (
        <div
            className={
                isBig
                    ? "token-detail-width token-detail-height"
                    : "standard-width standard-height"
            }
            style={{ position: "relative" }}
        >
            {displayArtifact && <LiveViewIFrame url={url} />}

            {displayArtifact && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: "-100",
                        paddingTop: "50%",
                    }}
                >
                    Loading live view...
                </div>
            )}

            {!displayArtifact && (
                <img
                    alt="token"
                    src={resolveIpfsCdn("png", displayUrl)}
                    onError={({ currentTarget }) => {
                        console.log("Image not found in CDN");
                        currentTarget.onerror = null; // prevents looping
                        fetch(
                            IPFS_UPLOADER_GATEWAY +
                                "png/" +
                                displayUrl.replace("ipfs://", "")
                        );
                        currentTarget.src = resolveIpfs(displayUrl);
                    }}
                />
            )}
        </div>
    );
}

export default TokenImage;
