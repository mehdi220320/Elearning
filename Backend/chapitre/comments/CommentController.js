const CommentService=require('./CommentService')

class CommentController{
    static async getByChapter(req,res){
        try {
            const chapterId=req.params.id
            const comments= await CommentService.getCommentsByChapter(chapterId)
            res.send(comments);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addComment(req,res){
        try {
            const { userId,chapterId,description } = req.body;
            const comment= CommentService.addComment(userId,chapterId,description)
            res.status(201).json(comment);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addLike(req,res){
        try {
            const { userId,commentId } = req.body;
            const like= CommentService.addLike(commentId,userId)
            res.status(201).json({message: "Like added successfully "+like});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async removeLike(req,res){
        try {
            const userId=req.params.userId
            const commentId=req.params.commentId
            const like= CommentService.removeLike(commentId,userId)
            res.status(201).json({message: "Like deleted successfully "+like});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteById(req,res){
        try {
            const id = req.params.id;
            await CommentService.deleteById(id)
            res.status(201).json({
                message: "Comment "+id+" has been deleted successfully"});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports=CommentController