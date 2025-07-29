import Layout from "./Layout";
function About() {
    return (
        <Layout>
            <div className="main">
                <h1>About EditArt</h1>
                <p>
                    EditArt is an NFT-Platform for generative art, where
                    collectors can co-create a piece of art with the artist
                    using 5 sliders. We focus on minimalistic design, smooth and
                    simple user experience and a no-bullshit, no-scam, high
                    quality space in the crypto jungle.
                </p>
                <h1>For artists</h1>
                <p>
                    EditArt is open to submissions from all generative artists.
                    If you would like to create a project on EditArt you can
                    find a template with all the instructions for development,
                    testing and submission below.
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
                    For details about the process, see the{" "}
                    <a
                        href="https://editart.xyz/artist-docs"
                        target="_blank"
                        rel="noreferrer"
                    >
                        artist docs
                    </a>
                </p>
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

                <h1>FAQ</h1>

                <ol>
                    <li>
                        <b>How to set username, thumbnail etc..?</b>
                        <br></br>User data is imported from objkt.com
                    </li>
                </ol>
                <h1>Fully on-chain metadata.</h1>
                <p>
                    First an artist creates a parameterized artwork. This
                    artwork will be uploaded to IPFS and the address of it is
                    immutably stored in a custom smart contract deployed for
                    each artwork. If a collector mints a piece, the parameters
                    for the piece are submitted to the smart contract and as
                    well immutably stored on chain. This process ensures full
                    decentralization, but makes it necessary that the token
                    metadata is generated on chain and is the reason why the
                    minting fees are higher that for example in fx(hash).
                    Editart has special priviliges on the contract to set a
                    displayURI and a thumbnailURI for the user's convenience and
                    for a smooth integration into other platforms. The
                    artifactURI on the other hand, which represents the actual
                    NFT, is totally immutable after mint.
                </p>
                <h1>Earn royalties as a collector</h1>
                <p>
                    As a collector has some artistic freedom when minting a
                    piece, they will also earn a share of the royalties when the
                    piece is re-sold.
                </p>
                <h1>Contracts</h1>
                <p>
                    Each editart token has its own contract with an included
                    marketplace functionality.
                </p>
                <p>Genesis: KT1D7Ufx21sz9yDyP4Rs1WBCur9XhaZ9JwNE</p>
                <h1>Fees</h1>
                <p>
                    Minting fee: 5%, Artist Royalties: 5%, Creator Royalties:
                    5%, Platform Royalties: 5%
                </p>
                <h1>Disclaimer</h1>
                <b>TL;DR USE AT YOUR OWN RISK.</b>
                <p>
                    Editart is an experimental platform. While every effort is
                    made by the team to provide a secure platform, Editart will
                    not accept any liability or responsibility for any kind of
                    damage created by the use of the platform.
                </p>
            </div>

            <hr />
            <h1>Terms of Use</h1>
            <h1>1. Acceptance of Terms</h1>
            <p>
                By accessing or using the Service, you agree to be bound by
                these Terms. If you do not agree, do not use the Service.
            </p>

            <h1>2. Eligibility</h1>
            <p>
                You must be at least 13 years old to use EditArt. If you are
                under the age of majority in your jurisdiction, you may only use
                the Service under the supervision of a parent or legal guardian.
            </p>

            <h1>3. Use of the Service</h1>
            <p>
                You agree to use the Service only for lawful purposes. You must
                not:
            </p>
            <ul>
                <li>Violate any laws or regulations;</li>
                <li>Infringe the intellectual property rights of others;</li>
                <li>
                    Use the Service to distribute harmful or malicious content;
                </li>
                <li>
                    Attempt to gain unauthorized access to the Service or
                    interfere with its operation.
                </li>
            </ul>

            <h1>4. User Content</h1>
            <p>If you submit, upload, or display any content via EditArt:</p>
            <ul>
                <li>You retain all rights in your content;</li>
                <li>
                    You grant us a non-exclusive, worldwide, royalty-free
                    license to use, display, and distribute your content in
                    connection with providing the Service.
                </li>
            </ul>
            <p>
                You are responsible for ensuring that your content complies with
                applicable laws and does not infringe the rights of any third
                party.
            </p>

            <h1>5. Intellectual Property</h1>
            <p>
                All content on EditArt, excluding user submissions, is the
                property of EditArt or its licensors and is protected by
                intellectual property laws.
            </p>

            <h1>6. Termination</h1>
            <p>
                We reserve the right to suspend or terminate your access to the
                Service at our discretion, with or without notice, if we believe
                you have violated these Terms.
            </p>

            <h1>7. Disclaimers and Limitation of Liability</h1>
            <p>
                The Service is provided "as is" without warranties of any kind.
                To the extent permitted by law, we disclaim all warranties,
                express or implied, and will not be liable for any damages
                arising from your use of the Service.
            </p>

            <h1>8. Changes to the Terms</h1>
            <p>
                We may update these Terms from time to time. We will notify you
                of changes by posting the new Terms on this page. Your continued
                use of the Service after changes are posted constitutes your
                acceptance.
            </p>

            <h1>9. Governing Law</h1>
            <p>
                These Terms are governed by the laws of Switzerland. Any
                disputes arising shall be subject to the exclusive jurisdiction
                of the courts in Zürich, Switzerland.
            </p>
            <hr />
            <h1>Privacy Policy</h1>

            <p>
                We aim to collect as little personal information as possible,
                and we respect your right to privacy and decentralization.
            </p>

            <h1>1. Minimal Data Collection</h1>
            <p>
                Currently, EditArt does not collect any personally identifiable
                information (such as your name or email address) and does not
                use any cookies or trackers. All activity is handled via
                decentralized systems and stored on-chain, where applicable.
            </p>

            <h1>2. On-Chain Interactions</h1>
            <p>
                Any data associated with your use of EditArt is typically stored
                on public blockchains. This means that while we do not store or
                control that data ourselves, it may be visible to anyone
                inspecting the chain. You are responsible for managing your own
                wallet and associated activity.
            </p>

            <h1>4. Third-Party Services</h1>
            <p>
                EditArt may use third-party infrastructure (e.g., hosting,
                analytics, or wallet connectors). These providers may handle
                some limited technical information like IP addresses or browser
                metadata for the purpose of delivering the service. We do not
                sell or rent any user data to third parties.
            </p>

            <h1>5. Your Rights</h1>
            <p>
                Even though we do not collect personal data directly, you have
                rights under Swiss and EU data protection laws. If you ever
                choose to provide personal information through future features,
                you will have the right to access, correct, delete, or object to
                its processing.
            </p>
        </Layout>
    );
}

export default About;
