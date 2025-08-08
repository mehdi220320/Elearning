const RatingService=require('./RatingService')
const path = require("path");

class RatingController{
    static async getAll(req , res){
        try {
            const ratings=await RatingService.getAll()
            res.status(200).send(ratings);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async addFormateur(req,res){
        try{
            const {formateurid,userid,comment,rate}=req.body
            const newRate=await RatingService.addRateFormateur(formateurid,userid,rate,comment);
            res.status(200).send(newRate);

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async addCourse(req,res){
        try{
            const {courseid,userid,comment,rate}=req.body
            console.log(courseid)
            const newRate=await RatingService.addRateCourse(courseid,userid,rate,comment);
            res.status(200).send(newRate);

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getRatesByFormateur(req,res){
        try {
            const id=req.params.id
            const rates=await RatingService.getRateByFormateur(id);
            res.status(200).send(rates);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getRatesByCourse(req,res){
        try {
            const id=req.params.id
            const rates=await RatingService.getRateByCourse(id);
            res.status(200).send(rates);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
module.exports=RatingController