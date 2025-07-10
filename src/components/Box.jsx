import { Link } from "react-router-dom";

import TokenImage from "./TokenImage";

function Box({ artifactUri, displayUri, link, line1, line2, topRight }) {
    return (
        <div
            style={{
                position: "relative",
                margin: "10px 30px 20px 0",
            }}
        >
            <TokenImage url={artifactUri} displayUrl={displayUri} strictlyDisplay={true} />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    marginTop: "3px",
                }}
            >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{line1}</span>
                {topRight && (
                    <span style={{ marginLeft: "10px", marginRight: 0 }}>{topRight}</span>
                )}
            </div>
            {line2 && (
                <div
                    style={{
                        marginTop: "3px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    {line2}
                </div>
            )}
            <Link to={link}>
                <div
                    className="standard-width standard-height"
                    style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        display: "inline-block",
                        padding: "20px",
                    }}
                ></div>
            </Link>
        </div>
    );
}

export default Box;
