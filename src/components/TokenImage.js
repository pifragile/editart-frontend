import { IPFS_UPLOADER_GATEWAY } from "../consts";
import { resolveIpfs, resolveIpfsCdn } from "../lib/utils";
function TokenImage({ displayUrl, url, isBig }) {
    return (
        <div
            className={
                isBig
                    ? "token-detail-width token-detail-height"
                    : "standard-width standard-height"
            }
            style={{ position: "relative" }}
        >
            {!displayUrl && (
                <iframe
                    title="token"
                    style={{
                        border: "None",
                        height: "100%",
                        width: "100%",
                    }}
                    src={resolveIpfs(url)}
                />
            )}

            {!displayUrl && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: "-100",
                        paddingTop: "50%",
                    }}
                >
                    Preview image not yet rendered
                    <br />
                    Loading live view...
                </div>
            )}

            {displayUrl && (
                <img
                    alt="token"
                    src={resolveIpfsCdn('png', displayUrl)}
                    onError={({ currentTarget }) => {
                        console.log('Image not found in CDN')
                        currentTarget.onerror = null; // prevents looping
                        fetch(IPFS_UPLOADER_GATEWAY + 'png/' + displayUrl.replace("ipfs://", ""))
                        currentTarget.src = resolveIpfs(displayUrl);
                    }}
                />
            )}
        </div>
    );
}

export default TokenImage;
