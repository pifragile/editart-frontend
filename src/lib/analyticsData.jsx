import { BACKEND_URL, ENV, TZKT_API } from "../consts";
import { fetchAllItemsWithSplitParams } from "./apiHelpers";

export const getAnalytics = async () => {
    const res = await fetch(`${BACKEND_URL}series`);

    let seriesList = await res.json();

    if (ENV === "prod")
        seriesList = seriesList.filter((e) => e.mainnetContract !== "");
    else seriesList = seriesList.filter((e) => e.testnetContract !== "");

    seriesList.forEach((e) => {
        e.contract = ENV === "prod" ? e.mainnetContract : e.testnetContract;
    });

    const contracts = seriesList.map((e) => e.contract);
    console.log(contracts);
    const allTransactions = await fetchAllItemsWithSplitParams(
        TZKT_API,
        "v1/operations/transactions",
        {
            "target.in": contracts,
           // "timestamp.gt" : "2025-01-01T00:00:00Z"
        }
    );

    
    const totalFees = allTransactions.reduce((acc, tx) => 
        acc + (tx.gasUsed || 0) + (tx.storageFee || 0) + (tx.bakerFee || 0),
        0
    );


    console.log(allTransactions)
    const mintTransactions = allTransactions.filter(t => t.parameter.entrypoint === 'mint')
    const distinctMinters = (new Set(mintTransactions.map(t => t.sender.address))).size
    
    console.log(`Number of transactions: ${allTransactions.length}`)
    console.log(`Fees paid: ${totalFees / 1000000} tez`)
    console.log(`Number of mints: ${mintTransactions.length}`)
    console.log(`Unique collectors: ${distinctMinters}`)
    console.log(allTransactions);
};
