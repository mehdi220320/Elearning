const HackathonService=require('./HackathonService')
const path = require("path");

class HackathonController {
    static async getAll(req,res){
        try {
            const hacks= await HackathonService.getAll()
            const hacksWithImageUrls = hacks.map(hack => ({
                ...hack.toObject(),
                coverImage: {
                    ...hack.coverImage,
                    path: `http://${req.get('host')}/uploads/${path.basename(hack.coverImage.path)}`
                }
            }));
            res.send(hacksWithImageUrls);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addHackathon(req,res){
        try {
            const { objectifs,rules,skills,maxParticipants,title,location,startDate,endDate,shortDescription,description,theme,courses,fee,Prizes } = req.body;
            const coverImageFile = req.file;
            if (!coverImageFile) {
                return res.status(400).json({ error: "L'image de profil est requise" });
            }
            const hackathon= HackathonService.addHackathon(objectifs,rules,skills,maxParticipants,coverImageFile,title,location,startDate,endDate,shortDescription,description,theme,courses,fee,Prizes)
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
    static async getById(req,res){
        try {
            const id=req.params.id
            let hack= await HackathonService.getById(id)
            hack.coverImage.path=`http://${req.get('host')}/uploads/${path.basename(hack.coverImage.path)}`;
            for(let course of hack.courses){
                course.coverImage.path=`http://${req.get('host')}/uploads/${path.basename(course.coverImage.path)}`;

            }
            res.send(hack);
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports=HackathonController