import { tweets } from "../tweets";
import TweetEmbed from "react-tweet-embed";

function TwitterFeed() {
    const tweetIds = tweets.map((t) => t.split("status/")[1].split("?")[0]);
    return (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tweetIds.map((t) => (
                <div
                    style={{
                        width: "min(300px, 80vw)",
                        margin: "5px",
                    }}
                    key={t}
                >
                    <TweetEmbed
                        tweetId={t}
                        options={{ conversation: "none" }}
                    />
                </div>
            ))}
        </div>
    );
}

export default TwitterFeed;
