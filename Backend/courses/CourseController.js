const path = require('path');
const CourseService=require('./CoursesService');
class CourseController{
    static async numberCourseActive(req, res) {
        try {
            const courses = await CourseService.numberCourseActive();
            res.status(200).send(courses.length);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getAll(req, res) {
        try {
            const courses = await CourseService.getAll();
            const coursesWithImageUrls = courses.map(course => ({
                ...course.toObject(),
                coverImage: {
                    ...course.coverImage,
                    path: `http://${req.get('host')}/uploads/${path.basename(course.coverImage.path)}`
                }
            }));
            res.status(200).send(courses);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async newestCourses(req, res) {
        try {
            const courses = await CourseService.newestCourses();
            res.status(200).send(courses.slice(0, 4));
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async add(req,res){
        try {
            const {learns, title, description, formateurId, categoryId, prix, description_detaillee, niveau, duree, langue, certificat } = req.body;
            const coverImageFile = req.file;
            if (!coverImageFile) {
                return res.status(400).json({ error: "L'image de profil est requise" });
            }
            const course = await CourseService.add({ learns,coverImageFile,title, description, formateurId, categoryId, prix, description_detaillee, niveau, duree, langue, certificat });
            res.status(201).json({ message: "Cours ajouté avec succès", course });
        }catch (error) {
            if (error.message.includes("Course Already Exists")) {
                res.status(409).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Data Invalide: " + error.message });
            } else {
                console.error('Server error:', error);
                res.status(500).json({ error: "Une erreur serveur s'est produite" });
            }
        }
    }
    static async isArchive(req,res){
        try {
            const id=req.params.id
            const updatedCourse=await CourseService.isArchive(id)
            const { status, _id, title } = updatedCourse;
            res.status(200).json({
                message: 'Course status updated successfully',
                course: { status, _id, title }
            });
        }catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getCoursesByInstructor(req,res){
        try {
            const id=req.params.id;
            const courses=await CourseService.getCoursesByInstructorId(id);
            const coursesWithImageUrls = courses.map(course => {
                const courseObj = course.toObject();
                if (courseObj.coverImage?.path) {
                    return {
                        ...courseObj,
                        coverImage: {
                            ...course.coverImage,
                            path: `http://${req.get('host')}/uploads/${path.basename(course.coverImage.path)}`
                        }
                    };
                }
                return chapterObj;
            });

            res.status(200).send(courses);
        }catch (e){
            res.status(500).json({ error: e.message });
        }
    }
    static async getCoursesByCategorie(req,res){
        try {
            const categoryId=req.params.id
            const courses=await CourseService.getCourseByCategorie(categoryId);
            const coursesWithImageUrls = courses.map(course => {
                const courseObj = course.toObject();
                if (courseObj.coverImage?.path) {
                    return {
                        ...courseObj,
                        coverImage: {
                            ...course.coverImage,
                            path: `http://${req.get('host')}/uploads/${path.basename(course.coverImage.path)}`
                        }
                    };
                }
                return chapterObj;
            });

            res.status(200).send(courses);
        }catch (e){
            res.status(500).json({ error: e.message });
        }
    }
    static async getById(req,res){
        try {
            const id=req.params.id
            let course=await CourseService.getCourseId(id);
            // course.coverImage.path=`http://${req.get('host')}/uploads/${path.basename(course.coverImage.path)}`;
            res.status(200).send(course);
        }catch (e){
            res.status(500).json({ error: e.message });
        }
    }
    static async update(req, res) {
        try {
            const id = req.params.id;
            const updates = req.body;
            const coverImageFile = req.file;

            // If there's a new image, add it to the updates
            if (coverImageFile) {
                updates.coverImage = {
                    path: coverImageFile.path,
                    contentType: coverImageFile.mimetype
                };
            }

            // Handle learns array if provided as string
            if (updates.learns && typeof updates.learns === 'string') {
                try {
                    updates.learns = JSON.parse(updates.learns);
                } catch (e) {
                    // If parsing fails, treat as a single value array
                    updates.learns = [updates.learns];
                }
            }

            const updatedCourse = await CourseService.update(id, updates);

            // Generate the full URL for the cover image
            if (updatedCourse.coverImage?.path) {
                updatedCourse.coverImage.path = `http://${req.get('host')}/uploads/${path.basename(updatedCourse.coverImage.path)}`;
            }

            res.status(200).json({
                message: "Course updated successfully",
                course: updatedCourse
            });
        } catch (error) {
            if (error.message.includes("not found")) {
                res.status(404).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Invalid data: " + error.message });
            } else if (error.message.includes("already exists")) {
                res.status(409).json({ error: error.message });
            } else {
                console.error('Server error:', error);
                res.status(500).json({ error: "A server error occurred" });
            }
        }
    }
    static async deleteById(req,res){
        try {
            const id= req.params.id;
            await CourseService.deleteCourseId(id);
            res.status(201).json({
                message: "Course "+id+" has been deleted successfully"});
        }catch (e){
            res.status(500).json({ error: error.message });

        }
    }
}
module.exports=CourseController