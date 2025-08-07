const Chapitre=require('./Chapitre')
const Course=require('../courses/Course')
class ChapitreService{
    static async addChapitre(title,description,file,url,courseId,nombrePage,dureeVideo ){
        try {
            const course=await Course.findById(courseId)

            if(!course){
                throw new Error("The course does not exist.")
            }
            const chapitre = await Chapitre.findOne({ title: title, course: course });

            if(chapitre){
                throw new Error("Chapitre already exists")
            }
            let data;
            if (file){data={title,description,file,url,course,nombrePage,dureeVideo }}
            else { data={title,description,url,course,dureeVideo }}

            const newChapitre=await new Chapitre(data);


            return await newChapitre.save();
        }catch (e){
            throw e;
        }
    }
    static async getAll(){
        try {
            return await Chapitre.find().populate({
                path: "course",
                select: "_id title"
            });
        }catch (e) {
            console.error('Error in getAll chapters:', e.message);
            throw e;
        }
    }
    static async getRessources() {
        try {
            return await Chapitre.find({ file: { $exists: true } })
                .populate({
                    path: "course",
                    select: "_id title"
                })
                .sort({ createdAt: -1 });
        } catch (e) {
            console.error('Error fetching Ressources of chapters:', e.message);
            throw new Error('Error fetching Ressources of chapters:');
        }
    }
    static async getMedias(){
        try {
            return await Chapitre.find({ url: { $exists: true } })
                .populate({
                    path: "course",
                    select: "_id title"
                })
                .sort({ createdAt: -1 });
        } catch (e) {
            console.error('Error fetching Media of chapters:', e.message);
            throw new Error('Error fetching Media of chapters:');
        }
    }
    static async getbycourse(id){
        try {
            return await Chapitre.find({course:id})
        }catch (e) {
            console.error('Error in getAll chapters:', e.message);
            throw e;
        }
    }
}

module.exports=ChapitreService