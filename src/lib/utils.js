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
