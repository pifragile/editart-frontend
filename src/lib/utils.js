import {
    SPACES_CDN_ENDPOINT,
    IPFS_GATEWAY,
    SPACES_ORIGIN_ENDPOINT,
} from "../consts";
import { getTokenMetadata, listContractBigmap } from "./api";

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
async function addCreators(data) {
    const creators = {};
    for (let token of data) {
        const address = token.contract.address;
        if (!(address in creators)) {
            creators[address] = await listContractBigmap(address, "creators");
        }
        token.creator = creators[address].find(
            (e) => e.key === token.tokenId
        )?.value;
    }
    return data;
}
export async function extractTokensForOverview(data) {
    if ("token" in data[0]) data = data.map((item) => item.token);
    data = await addCreators(data);
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
    if (url.includes("index.html")) return url;

    const idx = url.indexOf("?");
    let outval;
    if (idx > -1) outval = url.substr(0, idx) + "/index.html" + url.substr(idx);
    else outval = url + "/index.html";

    return outval;
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function fetchRetry(url, fetchOptions = {}, tries = 1) {
    function onError(err) {
        const delay = Math.random(500);
        const triesLeft = tries - 1;
        if (!triesLeft) {
            throw err;
        }
        return wait(delay).then(() =>
            fetchRetry(url, fetchOptions, triesLeft)
        );
    }
    return fetch(url, fetchOptions).catch(onError);
}

export function queryStringFromValues(m0, m1, m2, m3, m4) {
    return `m0=${m0}&m1=${m1}&m2=${m2}&m3=${m3}&m4=${m4}`;
}

export function valuesFromQueryString(queryString) {
    const urlParams = new URLSearchParams(queryString);
    const m0 = urlParams.get("m0");
    const m1 = urlParams.get("m1");
    const m2 = urlParams.get("m2");
    const m3 = urlParams.get("m3");
    const m4 = urlParams.get("m4");

    return [m0, m1, m2, m3, m4];
}
