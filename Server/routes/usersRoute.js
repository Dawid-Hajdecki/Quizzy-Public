import express from 'express';
import cel from 'celebrate';
import BodyParser from 'body-parser';

import { getUser, getAllUsers, checkIfBanned, changeBanStatus, changeProfileData, register, login } from '../controllers/usersController.js'
//import auth from '../middleware/auth.js';

const router = express.Router();
const { celebrate, Joi, errors} = cel;

const app = express();

router.get('/', getUser);
router.get('/all', getAllUsers);
router.put('/', celebrate({
  body: Joi.object().keys({
      userId: Joi.string(),
      name: Joi.string().min(5).regex(/^[a-zA-Z-_ ]+$/i),
      email: Joi.string().email().normalize(),
      oldPassword: Joi.string().min(7),
      password: Joi.string(),
      type: Joi.string()
  })
}), changeProfileData)
router.post('/login', celebrate({
  body: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email().normalize(),
      password: Joi.string(),
      confirmPassword: Joi.string()
  })
}), login)

router.post('/register', celebrate({
  body: Joi.object().keys({
      name: Joi.string().min(5).regex(/^[a-zA-Z-_ ]+$/i),
      email: Joi.string().email().normalize(),
      password: Joi.string().min(7),
      confirmPassword: Joi.string()
  })
}), register);

router.post('/ban/check', checkIfBanned);
router.post('/ban/changeStatus', changeBanStatus);
  
app.use(errors());
export default router;