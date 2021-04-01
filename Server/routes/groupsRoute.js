import express from 'express';
import cel from 'celebrate';

import { getAllGroups, getUserGroups, createGroup, editGroup, deleteGroup, joinGroup, adminJoinGroup, leaveGroup } from '../controllers/groupsController.js'
import {checkGroupLeader, checkUserAdmin} from '../middleware/auth.js';

const router = express.Router();
const { celebrate, Joi, errors, Segments } = cel;

router.get('/', getAllGroups);
router.post('/getUserGroups', getUserGroups);

router.post('/', celebrate({
    body: Joi.object().keys({
        userId: Joi.string(),
        name: Joi.string().min(5).regex(/^[a-zA-Z-_ ]+$/i),
        description: Joi.string().min(7),
        scope: Joi.string(),
        password: Joi.string().min(7),
        confirmPassword: Joi.string()
    })
}), createGroup);

router.put('/', checkUserAdmin, checkGroupLeader, celebrate({
    body: Joi.object().keys({
        userId: Joi.string(),
        groupId: Joi.string(),
        prevName: Joi.string(),
        name: Joi.string().min(5).regex(/^[a-zA-Z-_ ]+$/i),
        description: Joi.string().min(7),
        scope: Joi.string(),
        password: Joi.string().min(7),
        confirmPassword: Joi.string()
    })
}), editGroup);

router.delete('/', checkUserAdmin, checkGroupLeader, deleteGroup);

router.post('/joinGroup', joinGroup);
router.post('/joinGroup/admin', adminJoinGroup);
router.post('/leaveGroup', leaveGroup);

export default router;