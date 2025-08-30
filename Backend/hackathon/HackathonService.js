const Hackathon=require('./Hackathon')
const Course=require('../courses/Course')
const Category=require('../categories/Category')
class HackathonService {
    static async addHackathon(objectifs,rules,skills,maxParticipants,coverImageFile,title,
                              location,startDate,endDate,shortDescription,
                              description,themeid,coursesId,fee,Prizes){
        try{
            let courses=[];
            for(let courseid of coursesId ){
                const course= await Course.findById(courseid);
                if(!course)  throw error("Course "+courseid+" Doesn't Exists");
                courses.push(course)
            }
            const coverImage = { path: coverImageFile.path, contentType: coverImageFile.mimetype }
            const theme=await Category.findById(themeid);
            if (!theme){
                console.error("Category Doesn't Exists")
                throw error("Category Doesn't Exists")
            }
            const hack=new Hackathon(
                {objectifs,rules,skills,maxParticipants,title,coverImage,location,
                startDate,endDate,shortDescription,
                description,theme,courses,fee,Prizes});
            return await hack.save();
        }catch (e){
            console.error('Error in addHackathon:', e.message);
            throw e;
        }
    }
    static async deleteHackathonById(id){
        try {
            return await Hackathon.deleteOne({_id:id})
        }catch (e){
            console.error('Error in deleteHackathon:', e.message);
            throw e;
        }
    }
    static async getAll() {
        try {
            return  await Hackathon.find().populate({
                path: "theme",
                select: "_id name"
            });
        } catch (e) {
            console.error('Error in getAllHackathon:', e.message);
            throw e;
        }
    }

    static async updateStatus() {
        try {
            let hackathons=await Hackathon.find();
            for (const h of hackathons) {
                const now = new Date();
                if (h.startDate <= now && h.endDate >= now && h.status !== "canceled" && h.status !=="completed") {
                    h.status = "ongoing";
                } else if (h.endDate < now && h.status !== "canceled") {
                    h.status = "completed";
                }
                await h.save();
            }
            return hackathons;
        } catch (e) {
            console.error("Error in updateStatus:", e.message);
            throw e;
        }
    }


    static async getById(id){
        try {
            return await Hackathon.findById(id)
                .populate({
                    path: "theme",
                    select: "_id name"
                })
                .populate({
                    path: "courses",
                    select: "_id title prix coverImage",
                    populate: [
                        {
                            path: "formateur",
                            select: "firstname lastname"
                        },
                        {
                            path: "categorie",
                            select: "name"
                        }
                    ]
                });

        }catch (e){
            console.error('Error in getById:', e.message);
            throw e;
        }
    }
    static async addParticipant(hackathonId, userId) {
        try {
            const hackathon = await Hackathon.findById(hackathonId);
            if (!hackathon) {
                throw new Error("Hackathon not found");
            }

            if (hackathon.participants.includes(userId)) {
                throw new Error("User already registered in this hackathon");
            }

            if (hackathon.maxParticipants && hackathon.participants.length >= hackathon.maxParticipants) {
                throw new Error("Maximum number of participants reached");
            }

            hackathon.participants.push(userId);
            if (hackathon.maxParticipants && hackathon.participants.length >= hackathon.maxParticipants) {
                hackathon.status = "completed"; // ou "full" si tu veux différencier
            }

            await hackathon.save();

            return await Hackathon.findById(hackathonId)
                .populate("participants", "firstname lastname email");
        } catch (e) {
            console.error("Error in addParticipant:", e.message);
            throw e;
        }
    }
    static async removeParticipant(hackathonId, userId) {
        try {
            const hackathon = await Hackathon.findById(hackathonId);
            if (!hackathon) {
                throw new Error("Hackathon not found");
            }

            if (!hackathon.participants.includes(userId)) {
                throw new Error("User is not registered in this hackathon");
            }
            if (hackathon.maxParticipants && hackathon.participants.length < hackathon.maxParticipants) {
                if (hackathon.startDate > new Date()) {
                    hackathon.status = "scheduled";
                } else {
                    hackathon.status = "ongoing";
                }
            }

            hackathon.participants = hackathon.participants.filter(
                (participantId) => participantId.toString() !== userId.toString()
            );

            await hackathon.save();

            return await Hackathon.findById(hackathonId)
                .populate("participants", "firstname lastname email");
        } catch (e) {
            console.error("Error in removeParticipant:", e.message);
            throw e;
        }
    }
    static async nextHackathons() {
        try {
            return await Hackathon.find({
                startDate: { $gt: new Date() }
            }) .sort({ startDate: 1 })
                .populate({
                path: "theme",
                select: "_id name"
            });
        } catch (e) {
            console.error('Error in nextHackathons:', e.message);
            throw e;
        }
    }
    static async updateHackathon(id, updateData, coverImageFile) {
        try {
            // Récupération du hackathon existant
            const hackathon = await Hackathon.findById(id);
            if (!hackathon) throw new Error("Hackathon not found");

            // Mettre à jour les champs simples
            const fields = [
                "title", "location", "startDate", "endDate",
                "shortDescription", "description", "fee", "Prizes",
                "maxParticipants", "objectifs", "skills", "rules"
            ];

            fields.forEach(field => {
                if (updateData[field] !== undefined) {
                    hackathon[field] = updateData[field];
                }
            });

            // Mettre à jour le thème si fourni
            if (updateData.theme) {
                const theme = await Category.findById(updateData.theme);
                if (!theme) throw new Error("Category doesn't exist");
                hackathon.theme = theme;
            }

            // Mettre à jour les cours si fournis
            if (updateData.courses && updateData.courses.length > 0) {
                const courses = [];
                for (let courseId of updateData.courses) {
                    const course = await Course.findById(courseId);
                    if (!course) throw new Error("Course " + courseId + " doesn't exist");
                    courses.push(course);
                }
                hackathon.courses = courses;
            }

            // Mettre à jour l'image si fournie
            if (coverImageFile) {
                hackathon.coverImage = { path: coverImageFile.path, contentType: coverImageFile.mimetype };
            }

            // Sauvegarder et retourner le hackathon mis à jour
            return await hackathon.save();
        } catch (e) {
            console.error("Error in updateHackathon:", e.message);
            throw e;
        }
    }

}
module.exports = HackathonService;