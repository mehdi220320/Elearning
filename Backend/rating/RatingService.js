const Rating=require('./Rating')
const Instructor = require("../instructor/Instructor");
const Category = require("../categories/Category");
const Course = require("../courses/Course");
const User=require("../user/User")
class RatingService{
     static async getAll(){
        try {
            return await Rating.find().populate({
                path: "user",
                select: "_id firstname lastname picture"
            })
        }catch (e){
            throw e;
        }
    }
     static async addRate(formateurid,courseid,userId,rate,comment){
        try {
            const formateur=await Instructor.findById(formateurid);
            const course=await Course.findById(courseid)
            const user=await User.findById(userId)
            if(!formateur || !course){
                console.error("Formateur or Course Doesn't Exists")
                throw error("Formateur or Course Doesn't Exists")
            }
            if(!user){
                console.error("User Doesn't Exists")
                throw error("User Doesn't Exists")
            }
            const newrate=new Rating({formateur,course,rate,comment,user})
            return newrate.save()

        }catch (e){
            throw e;
        }
    }
    static async  getRateByFormateur(formateurId){
         try {
             const formateur=await Instructor.findById(formateurId);
             if(!formateur){
                 console.error("Formateur Doesn't Exists")
                 throw error("Formateur Doesn't Exists")
             }
             return await Rating.find({formateur:formateur}).populate({
                 path: "user",
                 select: "_id firstname lastname picture"
             })
         }catch (e){
             throw e;
         }
    }
    static async  getRateByCourse(courseId){
        try {
            const course=await Course.findById(courseId);
            if(!course){
                console.error("Formateur Doesn't Exists")
                throw error("Formateur Doesn't Exists")
            }
            return await Rating.find({course:course}).populate({
                path: "user",
                select: "_id firstname lastname picture"
            })
        }catch (e){
            throw e;
        }
    }
}

module.exports=RatingService