import { useEffect, useState } from "react";
import { OBJKT_API } from "../consts";
import { Link } from "react-router-dom";

function UserDetail({ address, isLink }) {
    const [tzProfile, setTzProfile] = useState(null);
    useEffect(() => {
        const fetchTzProfile = async (address) => {
            if (!address) return;
            let query = `query MyQuery {
                holder(where: {address: {_eq: "${address}"}}) {
                  alias
                  logo
                  twitter
                  website
                  description
                }
              }`;

            let res = await fetch(OBJKT_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query,
                }),
            });

            if (res.status === 200) {
                let data = await res.json();
                let holder = data.data.holder;
                if (holder.length > 0 && holder[0].alias != null) {
                    setTzProfile(holder[0]);
                }
            }
        };
        fetchTzProfile(address).catch(console.error);
    }, [address]);

    function getAddrString(address) {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    if (isLink) {
        return (
            <Link to={`/user/${address}`}>
                {tzProfile && <span>{tzProfile.alias}</span>}
                {!tzProfile && <span>{getAddrString(address)}</span>}
            </Link>
        );
    } else {
        return (
            <div className="standard-width">
                {tzProfile && (
                    <div style={{ marginBottom: "2vw" }}>
                        {/* FIXME uncomment when tzprofiles starts working again */}
                        {/* <img
                            src={tzProfile.logo}
                            style={{ width: "50px" }}
                            alt="Logo"
                        ></img> */}
                        <div>
                            <b>{tzProfile.alias}</b>
                        </div>
                        <div>{tzProfile.description}</div>

                        {tzProfile.twitter && (
                            <div>
                                <a href={tzProfile.twitter}>
                                    {"@" + tzProfile.twitter.split("com/")[1]}
                                </a>
                            </div>
                        )}

                        <div>
                            <a href={tzProfile.website}>{tzProfile.website}</a>
                        </div>
                    </div>
                )}
                {!tzProfile && (
                    <div>
                        <b>{address}</b>
                    </div>
                )}
            </div>
        );
    }
}

export default UserDetail;
