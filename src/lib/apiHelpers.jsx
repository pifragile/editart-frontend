// Helper function to build query string
const buildQueryString = (params) =>
    Object.entries(params)
        .map(
            ([key, value]) =>
                //`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                `${key}=${value}`
        )
        .join("&");

// Helper function to split a list into manageable chunks
const splitParamList = (list, maxChunkLength) => {
    const chunks = [];
    let currentChunk = [];

    for (const item of list) {
        currentChunk.push(item);
        const testChunk = currentChunk.join(",");
        if (testChunk.length > maxChunkLength) {
            currentChunk.pop(); // Remove the last item that caused overflow
            chunks.push(currentChunk.join(","));
            currentChunk = [item]; // Start a new chunk with the overflow item
        }
    }
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(","));
    }

    return chunks;
};

// Helper function to fetch paginated data
const fetchPaginatedData = async (
    baseUrl,
    endpoint,
    queryParams,
    limit,
    allItems
) => {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        try {
            queryParams.offset = offset;
            queryParams.limit = limit;

            const queryString = buildQueryString(queryParams);
            const response = await fetch(
                `${baseUrl}${endpoint}?${queryString}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            allItems.push(...data);

            // Check if fewer items are returned than the limit (no more data)
            if (data.length < limit) {
                hasMore = false;
            } else {
                offset += limit; // Increment offset for the next batch
            }
        } catch (error) {
            console.error(`Error fetching data: ${error.message}`);
            hasMore = false; // Stop further attempts on error
        }
    }
};

/**
 * Fetch all items from the TzKT API for a specific query using pagination,
 * ensuring only one parameter is chunked if necessary and treating others normally.
 *
 * @param {string} baseUrl - The base URL of the TzKT API.
 * @param {string} endpoint - The specific API endpoint (e.g., "operations").
 * @param {object} params - Query parameters for filtering.
 * @param {number} limit - Number of items to fetch per request.
 * @param {number} maxUrlLength - Maximum allowed URL length.
 * @returns {Promise<array>} - A promise that resolves to a list of all items.
 */
export async function fetchAllItemsWithSplitParams(
    baseUrl,
    endpoint,
    params = {},
    limit = 10000,
    maxUrlLength = 2000
) {
    const allItems = [];
    let chunkedParamKey = null;
    let chunks = [];

    // Process parameters
    const processedParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            const testChunk = `${key}=${value.join(",")}`;
            if (testChunk.length > maxUrlLength) {
                if (chunkedParamKey) {
                    throw new Error(
                        "Only one parameter can be chunked. Multiple long list parameters detected."
                    );
                }
                chunkedParamKey = key;
                chunks = splitParamList(value, Math.floor(maxUrlLength / 2));
            } else {
                // If the parameter is not too long, treat it as a regular joined parameter
                processedParams[key] = value.join(",");
            }
        } else {
            processedParams[key] = value; // Non-list parameters
        }
    }

    if (chunkedParamKey) {
        // Fetch data for each chunk
        for (const chunk of chunks) {
            const queryParams = {
                ...processedParams,
                [chunkedParamKey]: chunk,
            };
            await fetchPaginatedData(
                baseUrl,
                endpoint,
                queryParams,
                limit,
                allItems
            );
        }
    } else {
        // Fetch data without chunking
        await fetchPaginatedData(
            baseUrl,
            endpoint,
            processedParams,
            limit,
            allItems
        );
    }

    return allItems;
}
