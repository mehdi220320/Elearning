const ReclamationService=require('./ReclamationService')
class ReclamationController{
    static async getAll(req,res){
        try {
            const recls= await ReclamationService.getAll()
            res.send(recls);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getById(req,res){
        try {
            const id=req.params.id
            const recl= await ReclamationService.getById(id)
            res.send(recl);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async makeItAsSeen(req,res){
        try {
            const id=req.params.id
            const recl= await ReclamationService.makeItSeenById(id)
            res.send(recl);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async add(req,res){
        try {
            const { sujet,type,description,userId,hackathonId,courseId } = req.body;
            const reclamation= ReclamationService.add(sujet,type,description,userId,hackathonId,courseId)
            res.status(201).json({message: "Reclamation added successfully ",reclamation:reclamation});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports=ReclamationController