import { useEffect, useState } from "react";

import { getToken } from "../lib/api";

import Box from "./Box";

function SeriesBox({ contract, author, name }) {
    const [artifactUri, setArtifactUri] = useState(null);
    const [displayUri, setDisplayUri] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                let token = await getToken(contract, 0);
                setArtifactUri(token.metadata.artifactUri);
                setDisplayUri(token.metadata.displayUri);
            } catch {
                console.log('token 0 not found for contract ' + contract)
            }
        };

        fetchToken().catch(console.error);
    }, [contract]);
    if (artifactUri && artifactUri !== "") {
        return (
            <Box
                artifactUri={artifactUri}
                displayUri={displayUri}
                link={`/series/${contract}`}
                line1={name}
                line2={`by ${author}`}
            />
        );
    }
}

export default SeriesBox;
