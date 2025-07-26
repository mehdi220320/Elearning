const Instructor = require('./Instructor')

class InstructorService{
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
            return await Instructor.find();
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
            return await Instructor.findByIdAndDelete(id)
        }catch (e) {
            console.error('Error in delete instructor by id:', e.message);
            throw e;
        }
    }
}
module.exports=InstructorService