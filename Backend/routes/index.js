const express = require('express');
const router = express.Router();

const userRoutes = require('../user/user.routes');
const authRoutes = require('../auth/auth.routes');
const chapitreRoutes = require('../chapitre/ChapitreRoute');
const commentRoutes = require('../chapitre/comments/CommentRoutes');
const categoryRoutes = require('../categories/CategoryRoutes');
const instructorRoutes = require('../instructor/InstructorRouter');
const courseRoutes = require('../courses/CourseRouter');
const ratingRoutes = require('../rating/RatingRoute');
const testRoutes = require('../test/TestRouter');
const hackathonRoutes = require('../hackathon/HackathonRoutes');
const reclamationRoutes = require('../reclamation/ReclamationRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/instructor', instructorRoutes);
router.use('/course', courseRoutes);
router.use('/chapitre', chapitreRoutes);
router.use('/chapitre/comments', commentRoutes);
router.use('/rate', ratingRoutes);
router.use('/tests', testRoutes);
router.use('/hackathon', hackathonRoutes);
router.use('/reclamation', reclamationRoutes);

module.exports = router;
