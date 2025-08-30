const InstructorService=require("./InstructorService")
const CategoryService = require("../categories/CategoryService");
const path = require('path');
const Category = require("../categories/Category");

class InstructorController{
    static async updateInstructor(req, res) {
        try {
            const id = req.params.id;
            const {
                adresse, experience, firstname, lastname, categoryId,
                email, biographie, phone, speciality, Competences,
                LinkedIn, Twitter, GitHub, Site_web
            } = req.body;

            let updatedData = {
                firstname,
                lastname,
                adresse,
                email,
                biographie,
                phone,
                speciality,
                Competences,
                LinkedIn,
                Twitter,
                GitHub,
                Site_web,
                experience
            };

            // handle category update
            if (categoryId) {
                const categorie = await Category.findById(categoryId);
                if (!categorie) {
                    return res.status(404).json({ error: "Category doesn't exist" });
                }
                updatedData.categorie = categorie;
            }

            // handle picture update
            if (req.file) {
                updatedData.picture = {
                    path: req.file.path,
                    contentType: req.file.mimetype
                };
            }

            const instructor = await InstructorService.updateInstructorById(id, updatedData);

            instructor.picture.path = `http://${req.get('host')}/uploads/${path.basename(instructor.picture.path)}`;

            res.status(200).json({
                message: "Instructor updated successfully",
                instructor
            });
        } catch (error) {
            console.error('Error updating instructor:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req,res){
        try{
            const insts=await InstructorService.getAll();
            const instsWithImageUrls = insts.map(instructor => ({
                ...instructor.toObject(),
                picture: {
                    ...instructor.picture,
                    path: `http://${req.get('host')}/uploads/${path.basename(instructor.picture.path)}`
                }
            }));
            res.status(201).send(instsWithImageUrls)
        }catch (e){
            res.status(500).json({ error: error.message });

        }
    }
    static async getInstructorByid(req,res){
        try {
            const id=req.params.id;
            let instructor= await InstructorService.getInstructorById(id)
            instructor.picture.path=`http://${req.get('host')}/uploads/${path.basename(instructor.picture.path)}`
            res.status(201).send(instructor)
        }catch (e){
            res.status(500).json({ error: error.message });

        }
    }
    static async addInstructor(req, res) {
        try {
            const { adresse, experience,firstname, lastname,categoryId, email, biographie, phone, speciality, Competences, LinkedIn, Twitter, GitHub, Site_web } = req.body;
            const pictureFile = req.file;
            const categorie=await Category.findById(categoryId);

            if (!categorie){
                console.error("Category Doesn't Exists")
                throw error("Category Doesn't Exists")
            }
            if (!pictureFile) {
                return res.status(400).json({ error: "L'image de profil est requise" });
            }

            const instructorData = {
                categorie,
                firstname,
                adresse,
                lastname,
                email,
                biographie,
                phone,
                speciality,
                Competences,
                LinkedIn,
                Twitter,
                GitHub,
                Site_web,
                experience,
                picture: { path: pictureFile.path, contentType: pictureFile.mimetype }
            };

            const instructor = await InstructorService.addInstructor(instructorData);
            res.status(201).json({ message: "Formateur ajouté avec succès", instructor });
        } catch (error) {
            if (error.message.includes("existe déjà")) {
                res.status(409).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Données invalides: " + error.message });
            } else {
                console.error('Server error:', error);
                res.status(500).json({ error: "Une erreur serveur s'est produite" });
            }
        }
    }
    static async deleteInstructor(req,res){
        try {
            const id= req.params.id;
            await InstructorService.deleteInstructorById(id);
            res.status(201).json({
                message: "Instructor "+id+" has been deleted successfully"});
        }catch (e){
            res.status(500).json({ error: error.message });

        }
    }

}

module.exports=InstructorController