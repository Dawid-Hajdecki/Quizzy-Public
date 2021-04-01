import jwt from 'jsonwebtoken';
import groupsModel from '../models/groupsModel.js';
import usersModel from '../models/usersModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const checkGroupLeader = async (req, res, next) => {
    if(res.locals.admin) {
        next();
        return;
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;

    let {groupId} = req.body
    !groupId && (groupId = req.body.groupData.groupId)

    try {
        const group = await groupsModel.findById(groupId);
        if(decodedDataId == group.groupTeacher){
            next();
        }else{
            return res.status(401).json({ message: "You are not authorized to do this."})
        }
    } catch (error) {
        console.log(error)
    }
}

export const checkUserAdmin = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;

    try {
        const isAdmin = await usersModel.findById(decodedDataId);

        if(isAdmin.type === "Admin") {
            res.locals.admin = true;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}