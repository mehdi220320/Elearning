const Hackathon=require('./Hackathon')
const Course=require('../courses/Course')
const Category=require('../categories/Category')
class HackathonService {
    static async addHackathon(coverImageFile,title,location,startDate,endDate,shortDescription,
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
            const hack=new Hackathon({title,coverImage,location,startDate,endDate,shortDescription,
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
    static async getAll(){
        try {
            return await Hackathon.find()
        }catch (e){
            console.error('Error in getAllHackathon:', e.message);
            throw e;
        }
    }
}
module.exports = HackathonService;