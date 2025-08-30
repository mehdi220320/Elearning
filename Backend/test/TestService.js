const Test = require('./Test');
const Chapter = require('../chapitre/Chapitre');
const AppError = require('./appError');
const APIFeatures = require('./apiFeatures');
const User = require('../user/User');

class TestService {
    static async createTest(testData) {
        const chapter = await Chapter.findById(testData.chapter);
        if (!chapter) {
            throw new AppError('Chapitre non trouvé', 404);
        }
        if (chapter.course.toString() !== testData.course.toString()) {
            throw new AppError('Le chapitre ne fait pas partie du cours sélectionné', 400);
        }
        console.log(testData.createdBy);
        const getUser=User.findById(testData.createdBy)
        if(!getUser){
            throw new AppError('L utilisateur n existe pas ', 400);
        }
        const test = await Test.create(testData);
        return test;
    }

    // Récupérer tous les tests (avec filtrage, tri, pagination)
    static async getAllTests(query) {
        const features = new APIFeatures(Test.find(), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tests = await features.query.populate('chapter course');
        return tests;
    }

    // Récupérer un test spécifique
    static async getTestById(testId) {
        const test = await Test.findById(testId)
            .populate('chapter course createdBy')
            .populate({
                path: 'results.user',
                select: 'name email'
            });

        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }

        return test;
    }

    static async getTestsByChapterId(chapterId) {
        const chapter= await Chapter.findById(chapterId);
        if(!chapter) {
            throw new AppError('Chapiter n existe pas ', 400);
        }
        const test = await Test.find({chapter:chapter})
            .populate('chapter course createdBy')
            .populate({
                path: 'results.user',
                select: 'name email'
            });

        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }

        return test;
    }

    // Mettre à jour un test
    static async updateTest(testId, updateData, userId) {
        const test = await Test.findById(testId);
        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }

        // Vérifier la cohérence chapitre/cours si l'un des deux est modifié
        // if (updateData.chapter || updateData.course) {
        //     const chapter = await Chapter.findById(updateData.chapter || test.chapter);
        //     if (!chapter) {
        //         throw new AppError('Chapitre non trouvé', 404);
        //     }
        //
        //     const courseId = updateData.course || test.course;
        //     if (chapter.course.toString() !== courseId.toString()) {
        //         throw new AppError('Le chapitre ne fait pas partie du cours sélectionné', 400);
        //     }
        // }

        // Ajouter l'utilisateur qui a fait la modification
        updateData.updatedBy = userId;

        const updatedTest = await Test.findByIdAndUpdate(testId, updateData, {
            new: true,
            runValidators: true
        });

        return updatedTest;
    }

    // Supprimer un test
    static async deleteTest(testId) {
        const test = await Test.findByIdAndDelete(testId);
        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }
        return test;
    }
    static async deleteTestsByChapter(id) {
        return await Test.deleteMany({ chapter: id });
    }
    static  getQuestion(questions,id){
        for(let q of questions){
            if(q._id==id) {
                return q
            }
        }
        throw new AppError('question'+id+' non trouvé', 404);
    }
    static  getSomePointsQuestion(questions){
        let i=0;
        for(let q of questions){
            i+=q.points
        }
        return i
    }
    static async submitTest(testId, userId, responses) {
        const test = await Test.findById(testId);
        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }
        let correctAnswers = 0;
        let points=0
        const detailedResponses = [];
        if (typeof responses === 'string') {
            try {
                responses = JSON.parse(responses);
            } catch (err) {
                throw new AppError('Invalid responses format', 400);
            }
        }

        for (const response of responses) {
            const question = this.getQuestion(test.questions,response.questionId);
            if (!question) {
                throw new AppError(`Question ${response.questionId} non trouvée`, 404);
            }

            const isCorrect = question.options[response.selectedOption]?.isCorrect;
            if (isCorrect) {
                points += question.points;
                correctAnswers+=1
            }

            detailedResponses.push({
                questionId: response.questionId,
                selectedOption: response.selectedOption,
                isCorrect
            });
        }

        const score = Math.round((points / this.getSomePointsQuestion(test.questions)) * 100);

        const result = {
            user: userId,
            score,
            responses: detailedResponses
        };

        test.results.push(result);
        await test.save();

        return {
            score,
            passed: score >= test.passingScore,
            correctAnswers,
            totalQuestions: test.questions.length
        };
    }

    // Récupérer les résultats d'un utilisateur
    static async getUserResults(testId, userId) {
        const test = await Test.findById(testId);
        if (!test) {
            throw new AppError('Test non trouvé', 404);
        }

        const userResults = test.results.filter(
            result => result.user.toString() === userId.toString()
        );

        return userResults;
    }
}

module.exports = TestService;