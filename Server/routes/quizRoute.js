import express from 'express';
import cel from 'celebrate';

import { getQuizzes, getQuiz, addQuiz, editQuiz, deleteQuiz, finishQuiz, getQuestions, addQuestion, editQuestion, deleteQuestion } from '../controllers/quizController.js'
import {checkGroupLeader, checkUserAdmin} from '../middleware/auth.js';

const { celebrate, Joi, errors, Segments } = cel;
const router = express.Router();

router.post('/quiz/get', getQuiz);
router.post('/quiz/getAll', getQuizzes);
router.put('/quiz', checkUserAdmin, checkGroupLeader, celebrate({
    body: Joi.object().keys({
        userId: Joi.string(),
        groupId: Joi.string(),
        name: Joi.string().min(5),
        tier: Joi.number().min(1).max(10),
        category: Joi.string().min(5),
        multiple: Joi.boolean()
    })
}), addQuiz);
router.post('/quiz', checkUserAdmin, checkGroupLeader, celebrate({
    body: Joi.object().keys({
        userId: Joi.string(),
        id: Joi.string(),
        groupId: Joi.string(),
        name: Joi.string().min(5),
        tier: Joi.number().min(1).max(10),
        category: Joi.string().min(5),
        multiple: Joi.boolean()
    })
}), editQuiz);
router.delete('/quiz', checkUserAdmin, checkGroupLeader, deleteQuiz);
router.post('/quiz/finished', finishQuiz);

router.post('/quiz/question/get', getQuestions);
router.put('/quiz/question', checkUserAdmin, checkGroupLeader, addQuestion);
router.post('/quiz/question', editQuestion);
router.delete('/quiz/question', checkUserAdmin, checkGroupLeader, deleteQuestion);

export default router;