const Instructor = require('./Instructor')
const CourseService=require('../courses/CoursesService')
class InstructorService{
    static async updateInstructorById(id, updatedData) {
        try {
            const instructor = await Instructor.findByIdAndUpdate(
                id,
                { $set: updatedData },
                { new: true, runValidators: true }
            );
            if (!instructor) {
                throw new Error("Instructor not found");
            }
            return instructor;
        } catch (e) {
            console.error('Error in update instructor by id:', e.message);
            throw e;
        }
    }

    static async addInstructor(_instructor) {
        try {
            const instructor = await Instructor.findOne({ email: _instructor.email });
            if (!instructor) {
                const inst = new Instructor(_instructor);
                return await inst.save();
            } else {
                throw new Error("Un formateur avec cet email existe déjà");
            }
        } catch (e) {
            console.error('Error in add instructor:', e.message);
            throw e;
        }
    }    static async getAll(){
        try {
            return await Instructor.find().populate({
                path: "categorie",
                select: "_id name"
            });;
        }catch (e) {
            console.error('Error in getAll instructors:', e.message);
            throw e;
        }
    }
    static async getInstructorById(id){
        try {
            return await Instructor.findById(id);
        }catch (e) {
            console.error('Error in getAll instructors:', e.message);
            throw e;
        }
    }
    static async deleteInstructorById(id){
        try {
            const courses=await CourseService.getCoursesByInstructorId(id)
            for(let course of courses){
                await CourseService.deleteCourseId(course._id)
            }
            return await Instructor.findByIdAndDelete(id)
        }catch (e) {
            console.error('Error in delete instructor by id:', e.message);
            throw e;
        }
    }
}
module.exports=InstructorService