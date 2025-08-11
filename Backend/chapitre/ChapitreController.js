const ChapitreService=require("./ChapitreService")
const path = require("path");
class ChapitreController{
    static async addChapitre(req, res) {
        try {
            const { title, description, url, courseId, nombrePage, dureeVideo } = req.body;
            const extractfile = req.file;

            let file = null;
            if (extractfile) {
                console.log(extractfile.name)
                file = { path: extractfile.path, contentType: extractfile.mimetype, size:extractfile.size,name:extractfile.name };
            }

            const chapitre = await ChapitreService.addChapitre(
                title,
                description,
                file,
                url,
                courseId,
                nombrePage,
                dureeVideo
            );

            res.status(201).json({ message: "Chapitre ajouté avec succès", chapitre });
        } catch (error) {
            if (error.message.includes("Chapitre already exists")) {
                res.status(409).json({ error: error.message });
            } else if (error.name === "ValidationError") {
                res.status(400).json({ error: "Données invalides : " + error.message });
            } else {
                console.error('Erreur serveur :', error);
                res.status(500).json({ error: "Une erreur serveur s'est produite" });
            }
        }
    }

    static async getAll(req, res) {
        try {
            const chapters = await ChapitreService.getAll();
            const chaptersWithImageUrls = chapters.map(chapter => {
                const chapterObj = chapter.toObject();

                if (chapterObj.file?.path) {
                    return {
                        ...chapterObj,
                        file: {
                            ...chapterObj.file,
                            path: `http://${req.get('host')}/uploads/${path.basename(chapterObj.file.path)}`
                        }
                    };
                }
                return chapterObj;
            });

            res.status(200).send(chaptersWithImageUrls);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getRessources(req, res) {
        try {
            const chapters = await ChapitreService.getRessources();
            const chaptersWithImageUrls = chapters.map(chapter => ({
                ...chapter.toObject(),
                file: {
                    ...chapter.file,
                    path: `http://${req.get('host')}/uploads/${path.basename(chapter.file.path)}`
                }
            }));

            res.status(200).send(chaptersWithImageUrls);
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
    static async getByCourseId(req,res){
        try {
            const id=req.params.id
            const chapters = await ChapitreService.getbycourse(id);
            const chaptersWithImageUrls = chapters.map(chapter => {
                const chapterObj = chapter.toObject();

                if (chapterObj.file?.path) {
                    return {
                        ...chapterObj,
                        file: {
                            ...chapterObj.file,
                            path: `http://${req.get('host')}/uploads/${path.basename(chapterObj.file.path)}`
                        }
                    };
                }
                return chapterObj;
            });

            res.status(200).send(chaptersWithImageUrls);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getVideoDurationByCourseId(req,res){
        try {
            const id=req.params.id
            const duree = await ChapitreService.VideoDuration(id);
            res.status(200).send(duree);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async getNumberOfDocumentsByCourseId(req,res){
        try {
            const id=req.params.id
            const numberOfDocuments = await ChapitreService.NumberOfDocumments(id);
            res.status(200).send(numberOfDocuments);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}
module.exports=ChapitreController