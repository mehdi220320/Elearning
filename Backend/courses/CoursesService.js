const Course = require('./Course')
const Instructor=require('../instructor/Instructor')
const ChapterService=require('../chapitre/ChapitreService')
const Category=require('../categories/Category')
const mongoose = require("mongoose");
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
                langue:courseData.langue,certificat:courseData.certificat,coverImage:coverImage,learns:courseData.learns})
            return await  newCourse.save();
        }catch (e) {
            console.error('Error in getAll instructors:', e.message);
            throw e;
        }
    }
    static async isArchive(id){
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return console.error( 'Invalid course ID format' );
            }

            const course = await Course.findById(id);

            if (!course) {
                return console.error( 'Course not found' );

            }

            course.status = course.status === undefined ? true : !course.status;

            course.markModified('status');

            return  await course.save();

        } catch (error) {
            console.error('Error archive course :', error);
            throw error;

        }
    }
    static async getCoursesByInstructorId(id){
        try {
            const instractor=await Instructor.findById(id);
            if(!instractor){
                console.error("Formateur Doesn't Exists")
                throw error("Formateur Doesn't Exists")
            }

            return await Course.find({formateur:instractor}).populate({
                path: "formateur",
                select: "_id firstname lastname"
            }).populate({
                path: "categorie",
                select: "_id name"
            });
        }catch (e) {
            console.error('Error in getAll courses:', e.message);
            throw e;
        }
    }
    static async getCourseId(id){
        try {
            return await Course.findById(id).populate({
                path: "categorie",
                select: "_id name"
            });;
        }catch (e) {
            console.error('Error in getAll courses:', e.message);
            throw e;
        }
    }
    static async getCourseByCategorie(categorieId){
        try {
            const categorie=await Category.findById(categorieId)
            if (!categorie){
                console.error("Category Doesn't Exists")
                throw error("Category Doesn't Exists")
            }
            return await Course.find({categorie:categorie}).populate({
                path: "formateur",
                select: "_id firstname lastname"
            }).populate({
                path: "categorie",
                select: "_id name"
            });;
        }catch (e) {
            console.error('Error in get Course By Categorie :', e.message);
            throw e;
        }
    }
    static async update(id, updates) {
        try {
            // Validate ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid course ID format");
            }

            // Check if course exists
            const existingCourse = await Course.findById(id);
            if (!existingCourse) {
                throw new Error("Course not found");
            }

            // Check if title is being updated and if it already exists (excluding current course)
            if (updates.title && updates.title !== existingCourse.title) {
                const courseWithSameTitle = await Course.findOne({
                    title: updates.title,
                    _id: { $ne: id } // Exclude current course
                });

                if (courseWithSameTitle) {
                    throw new Error("Course title already exists");
                }
            }

            // Handle formateur reference if provided
            if (updates.formateurId) {
                const formateur = await Instructor.findById(updates.formateurId);
                if (!formateur) {
                    throw new Error("Instructor doesn't exist");
                }
                updates.formateur = updates.formateurId;
                delete updates.formateurId;
            }

            // Handle category reference if provided
            if (updates.categoryId) {
                const category = await Category.findById(updates.categoryId);
                if (!category) {
                    throw new Error("Category doesn't exist");
                }
                updates.categorie = updates.categoryId;
                delete updates.categoryId;
            }

            // Convert string boolean values to actual booleans
            if (typeof updates.certificat === 'string') {
                updates.certificat = updates.certificat.toLowerCase() === 'true';
            }

            if (typeof updates.status === 'string') {
                updates.status = updates.status.toLowerCase() === 'true';
            }

            // Update the course
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            ).populate({
                path: "formateur",
                select: "_id firstname lastname"
            }).populate({
                path: "categorie",
                select: "_id name"
            });

            return updatedCourse;
        } catch (error) {
            console.error('Error updating course:', error.message);
            throw error;
        }
    }
    static async deleteCourseId(id){
        try {
            await ChapterService.deleteChaptersByCourseId(id)
            return await Course.findByIdAndDelete(id)
        }catch (e){
            console.error('Error delete course:', error.message);
            throw error;
        }
    }
}
module.exports=CoursesService