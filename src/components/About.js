import Layout from "./Layout";
function About() {
    return (
        <Layout>
            <div className="main">
                <h1>For artists</h1>
                <p>
                    EditART is open to submissions form all generative artists.
                    If you would like to create a project on EditArt you can
                    find a template with all the instructions{" "}
                    <a
                        href="https://github.com/pifragile/editartSimpleTemplate"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {" "}
                        here
                    </a>
                    . If you have any questions, reach out on twitter
                    <a
                        href="https://twitter.com/pifragile/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {" "}
                        @pifragile
                    </a>
                    .
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
                            Download template
                        </button>
                    </a>
                </p>

                <h1>About EditART</h1>
                <p>
                    With Editart, collectors can become creators by co-creating
                    a piece together with the artist. Currently there are 5
                    value sliders available that can be tuned by the collector
                    when minting a piece.
                </p>
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
                    minting fees are slightly higher that for example in
                    fx(hash). Editart has special priviliges on the contract to
                    set a displayURI and a thumbnailURI for the user's
                    convenience and for a smooth integration into other
                    platforms. The artifactURI on the other hand, which
                    represents the actual NFT, is totally immutable after mint.
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
        </Layout>
    );
}

export default About;
