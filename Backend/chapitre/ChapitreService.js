const Chapitre=require('./Chapitre')
const Course=require('../courses/Course')
class ChapitreService {
    static async addChapitre(title, description, courseId, sections) {
        try {
            const course = await Course.findById(courseId);
            if (!course) throw new Error("The course does not exist.");

            const existing = await Chapitre.findOne({ title, course });
            if (existing) throw new Error("Chapitre already exists");

            const data = {
                title,
                description,
                course,
                section: sections || []
            };

            const newChapitre = new Chapitre(data);
            return await newChapitre.save();
        } catch (e) {
            throw e;
        }
    }

    static async getAll() {
        return await Chapitre.find().populate({
            path: "course",
            select: "_id title"
        });
    }

    static async getRessources() {
        // chapters having at least one section with a file
        return await Chapitre.find({ "section.file": { $exists: true } })
            .populate({ path: "course", select: "_id title" })
            .sort({ createdAt: -1 });
    }

    static async getMedias() {
        // chapters having at least one section with a url
        return await Chapitre.find({ "section.url": { $exists: true, $ne: null } })
            .populate({ path: "course", select: "_id title" })
            .sort({ createdAt: -1 });
    }

    static async getbycourse(id) {
        return await Chapitre.find({ course: id });
    }

    static async VideoDuration(id) {
        const chapters = await Chapitre.find({ course: id });
        let total = 0;
        for (let chap of chapters) {
            if (chap.section?.length) {
                for (let sec of chap.section) {
                    if (sec.dureeVideo) total += sec.dureeVideo;
                }
            }
        }
        return total;
    }

    static async NumberOfDocuments(id) {
        const chapters = await Chapitre.find({ course: id });
        let total = 0;
        for (let chap of chapters) {
            if (chap.section?.length) {
                for (let sec of chap.section) {
                    if (sec.file) total += 1;
                }
            }
        }
        return total;
    }
}
module.exports=ChapitreService