import { useEffect, useState } from "react";

import { getToken } from "../lib/api";

import Box from "./Box";

function SeriesBox({ contract, author, name }) {
    const [artifactUri, setArtifactUri] = useState(null);
    const [displayUri, setDisplayUri] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            let token = await getToken(contract, 0);
            setArtifactUri(token.metadata.artifactUri);
            setDisplayUri(token.metadata.displayUri);
        };

        fetchToken().catch(console.error);
    }, [contract]);
    if (artifactUri) {
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
