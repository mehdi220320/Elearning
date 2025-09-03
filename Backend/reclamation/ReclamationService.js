const Reclamation=require('./Reclamation')
const Course = require("../courses/Course");
const Hackathon = require("../hackathon/Hackathon");
const User=require('../user/User')
class ReclamationService{
    static async add(sujet, type, description, userId, hackathonId, courseId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                console.error("User doesn't exist");
                throw new Error("User doesn't exist");
            }

            let course = null;
            if (courseId !== null && courseId !== "") {
                course = await Course.findById(courseId);
                if (!course) {
                    console.error("Course doesn't exist");
                    throw new Error("Course doesn't exist");
                }
            }

            let hackathon = null;
            if (hackathonId !== null && hackathonId !== "") {
                hackathon = await Hackathon.findById(hackathonId);
                if (!hackathon) {
                    console.error("Hackathon doesn't exist");
                    throw new Error("Hackathon doesn't exist");
                }
            }

            let reclamation;

            if (hackathon && course) {
                console.log("1")
                reclamation = new Reclamation({
                    sujet,
                    type,
                    description,
                    creator: user,
                    hackathon,
                    cours:course
                });
            } else if (hackathon) {
                console.log("1")
                reclamation = new Reclamation({
                    sujet,
                    type,
                    description,
                    creator: user,
                    hackathon
                });
            } else if (course) {
                console.log("3")
                reclamation = new Reclamation({
                    sujet,
                    type,
                    description,
                    creator: user,
                    cours:course
                });
            } else {
                console.log("4")
                reclamation = new Reclamation({
                    sujet,
                    type,
                    description,
                    creator: user
                });
            }

            return await reclamation.save();
        } catch (e) {
            console.error("Error in add Reclamation:", e.message);
            throw e;
        }
    }
    static async getAll(){
        try {
            return await Reclamation.find().populate({
                path: "creator",
                select: "_id lastname firstname "
            }).populate({
                path: "cours",
                select: "_id title "
            }).populate({
                path: "hackathon",
                select: "_id title "
            });
        }catch (e){
            console.error('Error in getAllReclamation:', e.message);
            throw e;
        }
    }
    static async newest(){
        try {
            return await Reclamation.find().populate({
                path: "creator",
                select: "_id lastname firstname "
            }).populate({
                path: "cours",
                select: "_id title "
            }).populate({
                path: "hackathon",
                select: "_id title "
            }).sort({ createdAt: -1 });
        }catch (e){
            console.error('Error in getAllReclamation:', e.message);
            throw e;
        }
    }
    static async getById(id){
        try {
            return await Reclamation.findById(id).populate({
                path: "creator",
                select: "_id lastname firstname email phone"
            }).populate({
                path: "cours",
                select: "_id title createdAt"
            }).populate({
                path: "hackathon",
                select: "_id title createdAt"
            });
        }catch (e){
            console.error('Error in get reclamation by id:', e.message);
            throw e;
        }
    }
    static async makeItSeenById(id){
        try {
            let reclamation=await  Reclamation.findById(id)
            if(!reclamation){
                console.error("reclamation doesn't exist");
                throw new Error("reclamation doesn't exist");
            }
            reclamation.seen=true;
            return reclamation.save()
        }catch (e){
            console.error('Error in get reclamation by id:', e.message);
            throw e;
        }
    }
}
module.exports=ReclamationService