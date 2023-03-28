import { IMAGE_CDN, IPFS_GATEWAY } from "../consts";
import { getTokenMetadata } from "./api";

export function resolveIpfsForImage(address) {
    if (address) {
        return address.replace("ipfs://", IMAGE_CDN) + '.png';
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
