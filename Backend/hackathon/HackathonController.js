const HackathonService=require('./HackathonService')

class HackathonController {
    static async getAll(req,res){
        try {
            const hacks= await HackathonService.getAll()
            res.send(hacks);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addHackathon(req,res){
        try {
            const { title,location,startDate,endDate,shortDescription,description,theme,courses,fee,Prizes } = req.body;
            const coverImageFile = req.file;
            if (!coverImageFile) {
                return res.status(400).json({ error: "L'image de profil est requise" });
            }
            const hackathon= HackathonService.addHackathon(coverImageFile,title,location,startDate,endDate,shortDescription,description,theme,courses,fee,Prizes)
            res.status(201).json({message: "hackathon added successfully "});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deleteHackathonById(req,res){
        try {
            const id = req.params.id;
            await HackathonService.deleteHackathonById(id)
            res.status(201).json({
                message: "Category "+id+" has been deleted successfully"});
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports=HackathonController