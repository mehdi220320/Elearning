const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questionText: {
        type: String,
        required: [true, 'Le texte de la question est obligatoire'],
        trim: true,
        maxlength: [500, 'La question ne peut pas dépasser 500 caractères']
    },
    options: {
        type: [{
            text: {
                type: String,
                required: [true, 'Le texte de l\'option est obligatoire'],
                trim: true,
                maxlength: [200, 'Une option ne peut pas dépasser 200 caractères']
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }],
        validate: {
            validator: function(options) {
                // Au moins 2 options et au moins une réponse correcte
                return options.length >= 2 && options.some(opt => opt.isCorrect);
            },
            message: 'Une question doit avoir au moins 2 options et une réponse correcte'
        }
    },
    points: {
        type: Number,
        default: 1,
        min: [1, 'Les points doivent être au moins 1']
    }
});

const TestResultSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est obligatoire']
    },
    score: {
        type: Number,
        required: [true, 'Le score est obligatoire'],
        min: [0, 'Le score ne peut pas être négatif'],
        max: [100, 'Le score ne peut pas dépasser 100%']
    },
    completedAt: {
        type: Date,
        default: Date.now
    },
    responses: [{
        questionId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        selectedOption: Number,
        isCorrect: Boolean
    }]
});

const TestSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Le titre du test est obligatoire'],
        trim: true,
        maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapitre',
        required: [true, 'Le chapitre associé est obligatoire']
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Le cours associé est obligatoire']
    },
    questions: {
        type: [QuestionSchema],
        required: [true, 'Le test doit contenir des questions'],
        validate: {
            validator: function(questions) {
                return questions.length > 0;
            },
            message: 'Le test doit contenir au moins une question'
        }
    },
    passingScore: {
        type: Number,
        default: 70,
        min: [0, 'Le score de passage ne peut pas être négatif'],
        max: [100, 'Le score de passage ne peut pas dépasser 100%']
    },
    timeLimit: {
        type: Number,
        min: [1, 'La limite de temps doit être d\'au moins 1 minute'],
        description: 'Limite de temps en minutes (0 pour aucun limite)'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    results: [TestResultSchema],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

TestSchema.index({ course: 1, chapter: 1 });
TestSchema.index({ isPublished: 1 });

TestSchema.pre('save', async function(next) {
    try {
        const Chapter = mongoose.model('Chapitre');
        const chapter = await Chapter.findById(this.chapter);

        if (!chapter) {
            throw new Error('Chapitre non trouvé');
        }

        if (chapter.course.toString() !== this.course.toString()) {
            throw new Error('Le chapitre ne fait pas partie du cours sélectionné');
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Test', TestSchema);