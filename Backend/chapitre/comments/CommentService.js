const Comment=require('./Comment')
const User=require('../../user/User')
const Chapitre=require('../Chapitre')
class CommentService{
    static async addComment(userId,chapterId,description){
        try {
            const user=await User.findById(userId);
            const chapter=await Chapitre.findById(chapterId);
            if(!user){
                console.error("User Doesn't Exists");
                throw error("User Doesn't Exists");
            }
            if(!chapter){
                console.error("chapter Doesn't Exists");
                throw error("chapter Doesn't Exists");
            }
            const comment=new Comment({user,chapter,description})
            return await comment.save();
        }catch (e) {
            throw e;
        }
    }
    static async getCommentsByChapter(chapterId){
        try {
            const chapter=await Chapitre.findById(chapterId);
            if(!chapter){
                console.error("chapter Doesn't Exists");
                throw error("chapter Doesn't Exists");
            }

            return await Comment.find({chapter:chapter}).
            populate({ path: "user",
                select: "_id firstname lastname picture "})

        }catch (e) {
            throw e;
        }
    }
    static async addLike(commentId,userId){
        try {
            const comment=await Comment.findById(commentId);
            const user=await User.findById(userId)
            if(!comment){
                console.error("Comment Doesn't Exists");
                throw error("Comment Doesn't Exists");
            }
            if(!user){
                console.error("User Doesn't Exists");
                throw error("User Doesn't Exists");
            }

            comment.likes.push(user);
            return await comment.save();
        }catch (e) {
            throw e;
        }
    }
    static async removeLike(commentId, userId) {
        try {
            const comment = await Comment.findById(commentId);
            const user = await User.findById(userId);

            if (!comment) {
                console.error("Comment Doesn't Exist");
                throw new Error("Comment Doesn't Exist");
            }
            if (!user) {
                console.error("User Doesn't Exist");
                throw new Error("User Doesn't Exist");
            }
            comment.likes = comment.likes.filter(
                (like) => like.toString() !== userId.toString()
            );

            return await comment.save();
        } catch (e) {
            throw e;
        }
    }

    static async deleteById(id){
        try {
            return await Comment.deleteOne({_id:id})
        }catch (e){
            console.error('Error in delete comment:', e.message);
            throw e;
        }
    }

}

module.exports=CommentService