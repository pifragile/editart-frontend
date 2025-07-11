import { IPFS_UPLOADER_GATEWAY } from "../consts";
import { resolveIpfs, resolveIpfsCdn } from "../lib/utils";
import LiveViewIFrame from "./LiveViewIFrame";
function TokenImage({ displayUrl, url, isBig, showArtifact, strictlyDisplay }) {
    const displayArtifact = showArtifact || !displayUrl;
    if (strictlyDisplay && !displayUrl) {
        return (
            <div
                className={
                    isBig
                        ? "full-size"
                        : "standard-width standard-height"
                }
                style={{ position: "relative" }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: "-100",
                        paddingTop: "50%",
                    }}
                >
                    Preview not available yet.
                </div>
            </div>
        );
    }
    
    return (
        <div
            className={
                isBig
                    ? "full-size"
                    : "standard-width standard-height"
            }
            style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
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
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        display: "block",
                    }}
                    onLoad={e => {
                        const img = e.currentTarget;
                        if (img.naturalWidth === img.naturalHeight) {
                            img.style.objectFit = "cover";
                        } else {
                            img.style.objectFit = "contain";
                        }
                    }}
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
