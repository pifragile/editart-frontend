import Layout from "./Layout";
import { useState } from "react";
import Editor from "./Editor";
function Sandbox() {
    const [sketchSrc, setSketchSrc] = useState("");

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
                <input type="submit" value="Submit" />
            </form>
            <Editor price={0} baseUrl={sketchSrc} showButton={true} />
        </Layout>
    );
}

export default Sandbox;
