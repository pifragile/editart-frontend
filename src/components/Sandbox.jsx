import Layout from "./Layout";
import { useState } from "react";
import Editor from "./Editor";

function Sandbox() {
    const [sketchSrc, setSketchSrc] = useState("");
    const [refreshCount, setRefreshCount] = useState(0);

    function handleSubmit(event) {
        event.preventDefault();
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
                <br/>
                <input className="btn btn-default" type="submit" value="Submit" />
                {sketchSrc && (
                <button className="btn btn-default" onClick={() => setRefreshCount(prev => prev + 1)}>
                    Refresh
                </button>
            )}
            </form>
            <Editor price={0} baseUrl={sketchSrc} showButton={false} key={refreshCount} />
        </Layout>
    );
}

export default Sandbox;
