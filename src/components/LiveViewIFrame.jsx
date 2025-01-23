import { resolveIpfsGatewaySketches, resolveIpfsSketches } from "../lib/utils";

function LiveViewIFrame({ url }) {
    return (
        <iframe
            title="token"
            id="tokenFrame"
            style={{
                border: "None",
                width: "100%",
                aspectRatio: "1/1"
            }}
            src={resolveIpfsSketches(url)}
        />
    );
}

export default LiveViewIFrame;
