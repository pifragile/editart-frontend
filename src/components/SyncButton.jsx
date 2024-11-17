import { useContext, useState, useEffect } from "react";
import { WalletContext } from "../lib/wallet";
import { TEZOS_NETWORK } from "../consts";

function SyncButton() {
    const client = useContext(WalletContext).client;

    const [activeAccount, setActiveAccount] = useState(null);

    useEffect(() => {
        const func = async () => {
            const account = await client.getActiveAccount();
            if (account) {
                setActiveAccount(account.address);
            }
        };
        func();
    }, [client]);

    let connect = async () => {
        let account = await client.getActiveAccount();
        if (!account) {
            await client.requestPermissions({
                network: { type: TEZOS_NETWORK },
            });
            account = await client.getActiveAccount();
            setActiveAccount(account);
        }
    };

    let disconnect = async () => {
        await client.disconnect();
        setActiveAccount(null);
    };

    return (
        <div
            style={{
                marginLeft: "5vw",
            }}
        >
            {!activeAccount && (
                <button className="btn btn-default" onClick={connect}>
                    Sync
                </button>
            )}
            {activeAccount && (
                <button className="btn btn-default" onClick={disconnect}>
                    Unsync
                </button>
            )}
        </div>
    );
}

export default SyncButton;
