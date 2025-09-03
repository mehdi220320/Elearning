const ChapitreService=require("./ChapitreService")
const path = require("path");
class ChapitreController {
    static async addChapitre(req, res) {
        try {
            const { title, description, courseId, sections } = req.body;

            let parsedSections = [];
            if (sections) {
                parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;
            }

            if (req.files && req.files.length > 0) {
                parsedSections = parsedSections.map((sec, idx) => {
                    const file = req.files[idx];
                    if (file) {
                        sec.file = {
                            path: file.path,
                            contentType: file.mimetype,
                            size: file.size,
                            name: file.originalname || file.filename
                        };
                    }
                    return sec;
                });
            }

            const chapitre = await ChapitreService.addChapitre(
                title,
                description,
                courseId,
                parsedSections
            );

            res.status(201).json({ message: "Chapitre ajouté avec succès", chapitre });
        } catch (error) {
            if (error.message.includes("Chapitre already exists")) {
                res.status(409).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Données invalides : " + error.message });
            } else {
                console.error("Erreur serveur :", error);
                res.status(500).json({ error: "Une erreur serveur s'est produite" });
            }
        }
    }

    static async getAll(req, res) {
        try {
            const chapters = await ChapitreService.getAll();

            const chaptersWithUrls = chapters.map(chapter => {
                const chapterObj = chapter.toObject();

                // For each section, add public file path if exists
                chapterObj.section = chapterObj.section.map(sec => {
                    if (sec.file?.path) {
                        return {
                            ...sec,
                            file: {
                                ...sec.file,
                                path: `http://${req.get("host")}/uploads/${path.basename(sec.file.path)}`
                            }
                        };
                    }
                    return sec;
                });

                return chapterObj;
            });

            res.status(200).send(chaptersWithUrls);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getRessources(req, res) {
        try {
            const chapters = await ChapitreService.getRessources();
            const chaptersWithUrls = chapters.map(chapter => {
                const obj = chapter.toObject();
                obj.section = obj.section.map(sec => {
                    if (sec.file?.path) {
                        sec.file.path = `http://${req.get("host")}/uploads/${path.basename(sec.file.path)}`;
                    }
                    return sec;
                });
                return obj;
            });

            res.status(200).send(chaptersWithUrls);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getMedia(req, res) {
        try {
            const chapters = await ChapitreService.getMedias();
            res.status(200).send(chapters);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getByCourseId(req, res) {
        try {
            const id = req.params.id;
            const chapters = await ChapitreService.getbycourse(id);

            const chaptersWithUrls = chapters.map(chapter => {
                const obj = chapter.toObject();
                obj.section = obj.section.map(sec => {
                    if (sec.file?.path) {
                        sec.file.path = `http://${req.get("host")}/uploads/${path.basename(sec.file.path)}`;
                    }
                    return sec;
                });
                return obj;
            });

            res.status(200).send(chaptersWithUrls);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getById(req, res) {
        try {
            const id = req.params.id;
            const chapter = await ChapitreService.getById(id);

            res.status(200).send(chapter);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getVideoDurationByCourseId(req, res) {
        try {
            const id = req.params.id;
            const duree = await ChapitreService.VideoDuration(id);
            res.status(200).send({ totalDuration: duree });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async getNumberOfDocumentsByCourseId(req, res) {
        try {
            const id = req.params.id;
            const numberOfDocuments = await ChapitreService.NumberOfDocuments(id);
            res.status(200).send({ totalDocuments: numberOfDocuments });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async updateChapitre(req, res) {
        try {
            const { id } = req.params;
            const { title, description, sections } = req.body;

            let parsedSections = [];
            if (sections) {
                parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;
            }

            // Traitement des fichiers si fournis
            if (req.files && req.files.length > 0) {
                parsedSections = parsedSections.map((sec, idx) => {
                    const file = req.files[idx];
                    if (file) {
                        sec.file = {
                            path: file.path,
                            contentType: file.mimetype,
                            size: file.size,
                            name: file.originalname || file.filename
                        };
                    }
                    return sec;
                });
            }

            const updateData = {
                title,
                description,
                sections: parsedSections
            };

            const updatedChapitre = await ChapitreService.updateChapitre(
                id,
                updateData
            );

            res.status(200).json({
                message: "Chapitre mis à jour avec succès",
                chapitre: updatedChapitre
            });
        } catch (error) {
            if (error.message.includes("Chapitre not found")) {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes("already exists")) {
                res.status(409).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Données invalides : " + error.message });
            } else {
                console.error("Erreur serveur :", error);
                res.status(500).json({ error: "Une erreur serveur s'est produite" });
            }
        }
    }
    static async deleteChapterById(req,res){
        try {
            const id = req.params.id;
            const chapter = await ChapitreService.deleteChapterById(id);

            res.status(200).send(chapter);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
module.exports=ChapitreController