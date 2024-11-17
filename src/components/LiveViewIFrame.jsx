import { resolveIpfsSketches } from "../lib/utils";

function LiveViewIFrame({ url }) {
    return (
        <iframe
            title="token"
            id="tokenFrame"
            style={{
                border: "None",
                height: "100%",
                width: "100%",
            }}
            src={resolveIpfsSketches(url)}
        />
    );
}

export default LiveViewIFrame;
