import Comment from "../../../components/comment";


export default {
    title: 'Comment',
    component: Comment
}

export const CommentComponent = () => <Comment/>
export const CommentComponentNick = () => <Comment nick={"PotatoHD"}/>
export const CommentComponentDate = () => <Comment date={"11.11.2002"}/>
export const CommentComponentRepliesCount = () => <Comment repliesCount={5}/>
export const CommentComponentNoReplies = () => <Comment repliesCount={0}/>
export const CommentComponentBody = () => <Comment body={"Mephi is the best university"}/>
export const CommentReplies = () => <Comment><Comment/></Comment>
