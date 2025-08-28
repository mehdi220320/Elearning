const Reclamation=require('./Reclamation')
const Course = require("../courses/Course");
const Hackathon = require("../hackathon/Hackathon");
const User=require('../user/User')
class ReclamationService{
    static async add(sujet,type,description,userId,hackathonId,courseId){
        try{

            const user=await User.findById(userId);
            if (!user){
                console.error("user Doesn't Exists")
                throw error("user Doesn't Exists")
            }
            if(courseId!==null){
                const course=await Course.findById(courseId);
                if (!course){
                    console.error("course Doesn't Exists")
                    throw error("course Doesn't Exists")
                }
            }
            if(hackathonId!==null){
                const hackathon=await Hackathon.findById(hackathonId);
                if (!hackathon){
                    console.error("hackathon Doesn't Exists")
                    throw error("hackathon Doesn't Exists")
                }
            }
            const reclamation = new Reclamation({sujet,type,description,creator:user,hackathon:hackathon,course:course})
            return await reclamation.save()
        }catch (e){
            console.error('Error in addHackathon:', e.message);
            throw e;
        }
    }
}