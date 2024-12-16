import Layout from "./Layout";
function ArtistDocs() {
    return (
        <Layout>
            <div className="main">
                <h1 id="development-and-sandbox-testing">
                    <a className="simple-link" href="#development-and-sandbox-testing">
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
                            Vanilla js template
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
                    <a className="simple-link" href="#project-submission">2. Project Submission</a>
                </h1>
                <p>
                    When your project is ready, please submit it{" "}
                    <a
                        href="https://editart.xyz/series-submission"
                        target="_blank"
                        rel="noreferrer"
                    >
                        here
                    </a>{" "}
                    and then DM{" "}
                    <a
                        href="https://twitter.com/pifragile/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        @pifragile
                    </a>
                </p>
                <h1 id="testing-on-testnet">
                    <a className="simple-link" href="#testing-on-testnet">3. Testing on Testnet</a>
                </h1>
                When you sumit your project, we will deploy it to testnet in
                order to check if everthing works well in the actual environment
                of the platform.
                <br />
                <br />
                Once the project is live on testnet, you will need some Tez
                there, we will happily send you some.
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
                            <li className="about-list-item">Does minting work?</li>
                            <li className="about-list-item">
                                Do i receive the tez from the mints in my wallet?
                            </li>
                            <li className="about-list-item">Are the previews rendered?</li>
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
                    <a className="simple-link" href="#deployment-to-mainnet">4. Deployment to Mainnet</a>
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
                        image of the series.
                    </li>
                    <li className="about-list-item">
                        Once you minted the first token, contact Piero and he
                        will publish your project to the front page.
                    </li>
                    <li className="about-list-item">
                        At the release date, go to the artist panel and unpause
                        the project, then the series will be open for minting
                        for everyone.
                    </li>
                </ol>
                <h1 id="the-artist-panel">
                    <a className="simple-link" href="#the-artist-panel">The Artist Panel</a>
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
                    <a className="simple-link" href="#need-help">Need help?</a>
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
            <div style={{height:"100vh"}}/>
        </Layout>
    );
}

export default ArtistDocs;
