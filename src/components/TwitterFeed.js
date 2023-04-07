import { TwitterTweetEmbed } from "react-twitter-embed";
import { tweets } from "../tweets";
function TwitterFeed() {
    const tweetIds = tweets.map(t => t.split('status/')[1].split('?')[0])
    return (
        <div style={{ display: "flex", flexWrap:"wrap"}}>
            {tweetIds.map((t) => (
                <div
                    style={{
                        margin: "5px"
                    }}
                    key={t}
                >
                    <TwitterTweetEmbed
                        tweetId={t}
                        options={{ conversation: "none" }}
                    />
                </div>
            ))}
        </div>
    );
}

export default TwitterFeed;
