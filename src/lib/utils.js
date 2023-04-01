import {
    SPACES_CDN_ENDPOINT,
    IPFS_GATEWAY,
    SPACES_ORIGIN_ENDPOINT,
} from "../consts";
import { getTokenMetadata } from "./api";

export function resolveIpfsCdn(type, address) {
    if (address) {
        return (
            address.replace("ipfs://", SPACES_CDN_ENDPOINT + type + "/") +
            `.${type}`
        );
    }
}

export function resolveIpfsOrigin(type, address) {
    if (address) {
        return (
            address.replace("ipfs://", SPACES_ORIGIN_ENDPOINT + type + "/") +
            `.${type}`
        );
    }
}

export function resolveIpfsSketches(address) {
    if (address) {
        address = insertIndexHtml(address);
        return address.replace("ipfs://", SPACES_ORIGIN_ENDPOINT + "sketches/");
    }
}

export function resolveIpfs(address) {
    if (address) {
        return address.replace("ipfs://", IPFS_GATEWAY);
    }
}

export function formatMutez(mutez) {
    return `${mutez / 1000000} tez`;
}

export async function extractTokensForOverview(data) {
    if ("token" in data[0]) data = data.map((item) => item.token);
    // use this when metadata is broken in api
    for (let token of data) {
        if (!("metadata" in token)) {
            token.metadata = await getTokenMetadata(
                token.contract.address,
                token.tokenId
            );
        }
    }
    return data;
}

export function insertIndexHtml(url) {
    if (url.includes("index.html")) return;

    const idx = url.indexOf("?");
    let outval;
    if (idx > -1) outval = url.substr(0, idx) + "/index.html" + url.substr(idx);
    else outval = url + "/index.html";

    return outval;
}
