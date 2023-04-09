import { IPFS_UPLOADER_GATEWAY, TZKT_API } from "../consts";
import { bytes2Char } from "@taquito/utils";
import { resolveIpfs, resolveIpfsOrigin } from "./utils";

export async function getToken(contract, tokenId) {
    let query = `v1/tokens/?contract=${contract}&tokenId=${tokenId}`;
    let res = await fetch(TZKT_API + query);
    let data = await res.json();
    if (data.length > 0) {
        return data[0];
    } else {
        return null;
    }
}

export async function getContractStorage(contract, key) {
    let query = `v1/contracts/${contract}/storage?path=${key}`;
    let res = await fetch(TZKT_API + query);
    let data = await res.json();
    return data;
}

export async function getContractStorageFull(contract) {
    let query = `v1/contracts/${contract}/storage`;
    let res = await fetch(TZKT_API + query);
    let data = await res.json();
    return data;
}

export async function getContractBigmap(contract, bigmap, key) {
    let query = `v1/contracts/${contract}/bigmaps/${bigmap}/keys/${key}`;
    let res = await fetch(TZKT_API + query);
    if (res.status === 200) {
        let data = await res.json();
        if (data && data.active) {
            return data.value;
        }
    }
}

export async function listContractBigmap(contract, bigmap) {
    let query = `v1/contracts/${contract}/bigmaps/${bigmap}/keys?limit=10000`;
    let res = await fetch(TZKT_API + query);
    if (res.status === 200) {
        let data = await res.json();
        return data.filter(e => e.active)
    }
}

export async function getContractMetadata(contract) {
    let query = `v1/contracts/${contract}/bigmaps/metadata/keys/`;
    let res = await fetch(TZKT_API + query);
    let data = await res.json();
    let url = bytes2Char(data[data.length - 1]["value"]);
    try {
        let response = await fetch(resolveIpfsOrigin("json", url));
        if (response.ok) return await response.json();
    } catch {}
    // trigger ipfs uploader gateway
    console.log('Metadata not found in Spaces')
    let response = await fetch(resolveIpfs(url));
    fetch(IPFS_UPLOADER_GATEWAY + "json/" + url.replace("ipfs://", ""));
    return await response.json();
}

export async function getTokenMetadata(contract, tokenId) {
    let raw_metadata = (
        await getContractBigmap(contract, "token_metadata", tokenId)
    ).token_info;
    let metadata = {};
    metadata.name = bytes2Char(raw_metadata.name);
    metadata.artifactUri = bytes2Char(raw_metadata.artifactUri);
    if (raw_metadata.displayUri)
        metadata.displayUri = bytes2Char(raw_metadata.displayUri);
    if (raw_metadata.thumbnailUri)
        metadata.thumbnailUri = bytes2Char(raw_metadata.thumbnailUri);
    return metadata;
}
