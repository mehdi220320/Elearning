const Course = require('./Course')
const Instructor=require('../instructor/Instructor')
const Category=require('../categories/Category')
class CoursesService{
    static async getAll(){
        try {
            return await Course.find().populate({
                path: "formateur",
                select: "_id firstname lastname"
            }).populate({
                path: "categorie",
                select: "name"
            });
        }catch (e) {
            console.error('Error in getAll courses:', e.message);
            throw e;
        }
    }
    static async add(courseData){
        try {
            const formateurId=courseData.formateurId;
            const categoryId=courseData.categoryId;
            const title=courseData.title;
            const formateur=await Instructor.findById(formateurId);
            const category=await Category.findById(categoryId);
            const course=await Course.findOne({title:title})
            if(!formateur){
                console.error("Formateur Doesn't Exists")
                throw error("Formateur Doesn't Exists")
            }
            if (!category){
                console.error("Category Doesn't Exists")
                throw error("Category Doesn't Exists")
            }
            if(course){
                console.error("Course Already Exists")
                throw error("Course Already Exists")
            }
            const coverImage = { path: courseData.coverImageFile.path, contentType: courseData.coverImageFile.mimetype }
            const  newCourse=new Course({description:courseData.description,title:courseData.title,formateur:formateur,categorie:category,
                prix:courseData.prix,description_detaillee:courseData.description_detaillee,niveau:courseData.niveau,duree:courseData.duree,
                langue:courseData.langue,certificat:courseData.certificat,coverImage:coverImage})
            return await  newCourse.save();
        }catch (e) {
            console.error('Error in getAll instructors:', e.message);
            throw e;
        }
    }
}
module.exports=CoursesService