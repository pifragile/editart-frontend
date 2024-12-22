import { IPFS_UPLOADER_GATEWAY, TZKT_API } from "../consts";
import { bytes2Char } from "@taquito/utils";
import { resolveIpfs, resolveIpfsOrigin } from "./utils";
import { fetchAllItemsWithSplitParams } from "./apiHelpers";

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

export async function getContract(contract) {
    let query = `v1/contracts/${contract}`;
    let res = await fetch(TZKT_API + query);
    let data = await res.json();
    return data;
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
    let query = `v1/contracts/${contract}/bigmaps/${bigmap}/keys?limit=10000&active=true`;
    let res = await fetch(TZKT_API + query);
    if (res.status === 200) {
        let data = await res.json();
        return data.filter((e) => e.active);
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
    console.log("Metadata not found in Spaces");
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

export async function getFeed(series, limit, offset) {
    let query =
        "v1/operations/transactions?" +
        new URLSearchParams({
            "target.in": series.map((e) => e.contract).join(","),
            "entrypoint.in": "mint,buy_item, list_item",
            "sort.desc": "level",
            status: "applied",
            select: [
                "storage",
                "diffs",
                "entrypoint",
                "sender",
                "target",
                "timestamp",
                "parameter",
            ],
            limit,
            offset,
        });

    const parseMint = (e) => ({
        timestamp: e.timestamp,
        contract: e.target.address,
        sender: e.sender.address,
        collectionName: bytes2Char(e.storage.collection_name),
        price: e.storage.price,
        tokenId: parseInt(e.storage.last_token_id) - 1,
        verb: "minted",
    });

    const parseListItem = (e) => ({
        timestamp: e.timestamp,
        contract: e.target.address,
        sender: e.sender.address,
        collectionName: bytes2Char(e.storage.collection_name),
        price: e.diffs[0].content.value,
        tokenId: e.diffs[0].content.key,
        verb: "listed",
    });

    const parseBuyItem = (e) => ({
        timestamp: e.timestamp,
        contract: e.target.address,
        sender: e.sender.address,
        collectionName: bytes2Char(e.storage.collection_name),
        price: e.diffs.find((x) => x.path === "listings").content.value,
        tokenId: e.diffs.find((x) => x.path === "listings").content.key,
        verb: "bought",
    });

    const functionMapper = {
        buy_item: parseBuyItem,
        list_item: parseListItem,
        mint: parseMint,
    };

    let res = await fetch(TZKT_API + query);
    if (res.status === 200) {
        let data = await res.json();
        return data.map((e) => functionMapper[e.parameter.entrypoint](e));
    }
}

export async function getFloorPrice(contract) {
    let listings = await listContractBigmap(contract, "listings");
    let prices = listings.map((e) => parseInt(e.value));
    return Math.min(...prices);
}

export async function fetchAllContractData(contractAddresses) {
    const bigMapNames = ["creators", "listings", "ledger"];
    const allContracts = await fetchAllItemsWithSplitParams(
        TZKT_API,
        "v1/contracts",
        {
            "address.in": contractAddresses,
            includeStorage: true,
        }
    );

    const allBigMapKeys = await fetchAllItemsWithSplitParams(
        TZKT_API,
        "v1/bigmaps/keys",
        {
            "bigmap.in": allContracts.map((c) =>
                bigMapNames.map((e) => c.storage[e])
            ),
            active: true,
        }
    );

    allContracts.forEach((c) => {
        bigMapNames.forEach((bigMap) => {
            const allKeys = allBigMapKeys.filter(
                (k) => k.bigmap === c.storage[bigMap]
            );
            const result = {};
            allKeys.forEach((k) => (result[k.key] = k));

            c.storage[bigMap] = result;
        });
    });

    return allContracts;
}
