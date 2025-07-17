import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import { useEffect } from "react";
function ArtistDocs() {
    const { hash } = useLocation(); // Get the current hash fragment from URL

    useEffect(() => {
        if (hash) {
            const id = hash.replace("#", ""); // Remove the "#" to get the ID
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" }); // Scroll smoothly to the section
            }
        }
    }, [hash]); // Re-run the effect when the hash changes

    return (
        <Layout>
            <div className="main">
                <h1 id="development-and-sandbox-testing">
                    <a
                        className="simple-link"
                        href="#development-and-sandbox-testing"
                    >
                        1. Development and Sandbox Testing
                    </a>
                </h1>
                <p>
                    EditArt is open to submissions form all generative artists.
                    If you would like to create a project on EditArt you can
                    find a template with all the instructions below.
                    <br />
                    <br />
                    <a
                        href="https://github.com/pifragile/editartSimpleTemplate"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button
                            className="btn btn-default"
                            name="template"
                            id="template"
                        >
                            Simple template
                        </button>
                    </a>
                    <br />
                    <br />
                    <a
                        href="https://github.com/pifragile/editArtP5Template"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <button
                            className="btn btn-default"
                            name="template"
                            id="template"
                        >
                            p5.js template
                        </button>
                    </a>
                </p>
                <p>
                    In order to test your project with the EditART platform,
                    start a local development server of your project and paste
                    its address in the{" "}
                    <a
                        href="https://editart.xyz/sandbox"
                        target="_blank"
                        rel="noreferrer"
                    >
                        sandbox
                    </a>{" "}
                    and you can start playing around with the sliders.
                </p>
                <h1 id="project-submission">
                    <a className="simple-link" href="#project-submission">
                        2. Project Submission
                    </a>
                </h1>
                <p>
                    When your project is ready, please submit it{" "}
                    <a
                        href="https://editart.xyz/series-submission"
                        target="_blank"
                        rel="noreferrer"
                    >
                        here
                    </a>
                    .
                    <br />
                    After submitting, you will have access to the following
                    tools to check if your series works as expected:{" "}
                    <ul>
                        <li>
                            <b>Series validation tool</b>
                            <br />
                            To make sure that your series created consistent
                            outputs.
                        </li>
                        <li>
                            <b>Grid view</b>
                            <br />
                            To check if the grid view works properly.
                        </li>
                        <li>
                            <b>Preview images</b>
                            <br />
                            You will see 4 preview images of your sketch
                            renderes alongside with the actual sketch. Make sure
                            the previews match the sketch exactly.
                        </li>
                    </ul>
                    <br />
                    <br />
                    <b>
                        When everything works well in the above mentioned tools
                    </b>
                    , contact us and we will deploy to testnet for you. After
                    that please follow step 3.
                    <br />
                    <br />
                    Once everything works, we will set a release date with you
                    and deploy to mainnet.
                </p>
                <u id="troubleshooting">
                    <a className="simple-link" href="troubleshooting">
                        Troubleshooting
                    </a>
                </u>
                <br />
                <br />
                The series validation tool does not show consistent outputs?
                <ul>
                    <li>
                        Are you only using the random functions
                        randomM0...randomM4 and randomFull to generate
                        randomness?
                    </li>
                    <li>
                        If you are using noise, did you seed the noise with one
                        of the slider values? E.g. noiseSeed(m2 * 999999999999)
                    </li>
                    <li>
                        Do you reinitialize all state at the beginning of the
                        drawArt() function? Any setup code outside of drawArt
                        will not be called on slider movement.
                    </li>
                </ul>
                <br />
                You dont get any previews or the previews are inconsistent?
                <ul>
                    <li>Do you call triggerPreview()?</li>
                    <li>
                        Is your code independent of window size? Does window
                        resizing work properly?
                    </li>
                    <li>
                        Is your code platform independent? The previews are
                        rendered on Ubuntu in Google Chrome.
                    </li>
                </ul>
                <br />
                The grid view does not work?
                <ul>
                    <li>
                        What happens under the hood is that 8 sketched are
                        loaded and once triggerPreview() is called a snapshot is
                        taken of the canvas and converted to an image. After
                        that 8 more sketches are loaded, and so on.
                    </li>
                    <li>
                        If it is not possible to make it work, we can disable
                        the grid view for your project.
                    </li>
                </ul>
                <p></p>
                <h1 id="testing-on-testnet">
                    <a className="simple-link" href="#testing-on-testnet">
                        3. Testing on Testnet
                    </a>
                </h1>
                Once deployed to testnet, check if everything works well in the
                actual environment of the platform.
                <br />
                <br />
                In order for everything to work, you have to change the RPC node
                in your wallet to Ghostnet.
                <br />
                Then follow these steps:
                <ol>
                    <li className="about-list-item">
                        If your mint has a price above 0, go to the artist panel
                        and reduce the price to something like 0.1 tez, such
                        that it is easier to test.
                    </li>
                    <li className="about-list-item">
                        Go to the artist panel and unpause the project.
                    </li>
                    <li className="about-list-item">
                        Make a couple of test mints until you're confident that
                        everything is working fine. What to check during
                        testing:
                        <ol>
                            <li className="about-list-item">
                                Is the series name and description correct?
                            </li>
                            <li className="about-list-item">
                                Does minting work?
                            </li>
                            <li className="about-list-item">
                                Do i receive the tez from the mints in my
                                wallet?
                            </li>
                            <li className="about-list-item">
                                Are the previews rendered?
                            </li>
                            <li className="about-list-item">
                                Are the previews exactly as expected? (there can
                                be discrepancies if your code is not platform
                                independent, be especially cautious if you are
                                using GLSL)
                            </li>
                        </ol>
                    </li>
                </ol>
                <h1 id="deployment-to-mainnet">
                    <a className="simple-link" href="#deployment-to-mainnet">
                        4. Deployment to Mainnet
                    </a>
                </h1>
                After successful testing on testnet, we will deploy your
                contract to mainnet. After deployment the contract is paused and
                only you can mint.
                <br />
                <br />
                Once the series is live, follow those steps:
                <ol>
                    <li className="about-list-item">
                        Mint the first token, this will also be the display
                        image of the series. You do not need to unpause the
                        project for that because you are the artist.
                    </li>
                    <li className="about-list-item">
                        <b>Important:</b> At the release date, go to the artist
                        panel and unpause the project, then the series will be
                        open for minting for everyone.
                    </li>
                    <li>
                        On objkt.com you can now go to profile - collaborations
                        - creator verifications and click accept for the the
                        collection, then you will appear properly as the artist.
                    </li>
                    <li>
                        Your username, avatar etc. is also pulled from
                        objkt.com, so you can adjust your profile there if
                        needed.
                    </li>
                </ol>
                <h1 id="the-artist-panel">
                    <a className="simple-link" href="#the-artist-panel">
                        The Artist Panel
                    </a>
                </h1>
                The artist panel can be found at
                editart.xyz/artist-panel/CONTRACT_ADDRESS
                <br />
                <br />
                It gives you the following options:
                <ol>
                    <li className="about-list-item">
                        <b>Pause/Unpause the project</b>
                        <br />
                        When the project is paused, only the artist can mint.
                    </li>
                    <li className="about-list-item">
                        <b>Change the price of the project</b>
                        <br />
                    </li>
                    <li className="about-list-item">
                        <b>Change the number of editions of the project</b>
                        <br />
                        Edition count can only be reduced, not increased.
                    </li>
                </ol>
                <h1 id="need-help">
                    <a className="simple-link" href="#need-help">
                        Need help?
                    </a>
                </h1>
                <p>
                    <p>
                        If you have any questions, reach out on{" "}
                        <a
                            href="https://twitter.com/pifragile/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            X
                        </a>
                    </p>
                </p>
            </div>
            <div style={{ height: "100vh" }} />
        </Layout>
    );
}

export default ArtistDocs;
