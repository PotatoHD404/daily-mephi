import Like from "./likeBtn";
import Dislike from "./dislikeBtn";
import Comment from "./commentBtn";

export default function Reactions() {
    return <div className="flex space-x-2 font-semibold mb-2">
        <Like/>
        <Dislike/>
        <Comment/>
    </div>;
}
