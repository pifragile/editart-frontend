import Layout from "./Layout";
import MintForm from "./MintForm";

import { useState } from "react";
function Sandbox() {
    const [sketchSrc, setSketchSrc] = useState("");
    let setSrc = (m0, m1, m2, m3, m4) => {
        let qs = `m0=${m0}&m1=${m1}&m2=${m2}&m3=${m3}&m4=${m4}`;
        document
            .getElementById("tokenFrame")
            .contentWindow.postMessage({ editartQueryString: qs }, "*");
    };

    function handleSubmit(event) {
        event.preventDefault();
        console.log(event);
        setSketchSrc(event.target[0].value);
    }

    return (
        <Layout>
            <h1>Preview</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Sketch URL:
                    <input type="url" id="sketchUrl" />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <div
                style={{
                    display: "flex",
                    marginTop: "2vw"
                    //justifyContent: "center",
                }}
            >
                <iframe
                    id="tokenFrame"
                    title="token"
                    className="token-detail-width token-detail-height"
                    style={{
                        border: "None",
                        marginRight: "2vw"
                    }}
                    src={sketchSrc}
                ></iframe>

                <div className="token-detail-width">
                    <MintForm
                        onSubmitForm={setSrc}
                        onMint={setSrc}
                        price={"1000000"}
                    />
                </div>
            </div>
        </Layout>
    );
}

export default Sandbox;
