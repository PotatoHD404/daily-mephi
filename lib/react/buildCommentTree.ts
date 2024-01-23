import type {Comment, CommentMapType} from "server/routers/comments";

export function buildCommentTree(comments: Comment[]): CommentMapType[] {

    const commentMap: { [key: string]: CommentMapType } = {};

    // Initialize the map and create a children container for each comment
    const rootComments: CommentMapType[] = [];

    comments.forEach(comment => {
        comment.path.reduce((previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
            // if the current id is not in the commentMap, add it
            if (!(currentValue in commentMap)) {
                commentMap[currentValue] = currentIndex !== array.length - 1 ? {
                    comment: null,
                    children: []
                } : {comment, children: []}
            } else {
                if (currentIndex === array.length - 1) {
                    commentMap[currentValue].comment = comment;
                }
                return currentValue;
            }
            if (currentIndex == 0) {
                // if it's the first element of the array, add the current comment to the root comments
                rootComments.push(commentMap[currentValue]);
                return currentValue;
            }
            // add the current comment to the children of the previous comment
            commentMap[previousValue].children.push(commentMap[currentValue]);
            return currentValue;
        });
    });
    return rootComments;
}