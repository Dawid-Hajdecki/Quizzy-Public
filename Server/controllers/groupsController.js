import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import groupsModel from '../models/groupsModel.js';
import usersModel from '../models/usersModel.js';

dotenv.config();

export const getAllGroups = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;
    console.log(decodedDataId);
    try {
        const user = await usersModel.findById(decodedDataId).select('groups.name');
        const a = user.groups
        const result = await groupsModel.find().select('name -_id');

        for(var i=0;i<result.length;i++){
            for(var j=0;j<a.length;j++){
                if(result[i].name === a[j].name){
                    result.splice(i,1);
                    --i;
                    break;
                }
            }
        } 
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(404).json({ result: error});
    }
}

export const getUserGroups = async (req, res) => {
    let result = []
    let count = 0;
    try {

        const findGroup = async (name) => {
            const group = await groupsModel.findOne({name})
            count++
            result.push(group)
            if (count === req.body.length) res.status(200).json(result)
        }

        for(var key in req.body){
            if(req.body.hasOwnProperty(key)){
                findGroup(req.body[key].name)
            }
        }

    } catch (error) {
        res.status(404).json({ result: error});
    }
}

export const createGroup = async (req, res) => {
    const { name, password, confirmPassword, description } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;
    
    try {
        const existingGroup = await groupsModel.findOne({ name });
        if(existingGroup ) return res.status(404).json({ message: "Group with this name already exists."});

        if(password !== confirmPassword) return res.status(406).json({ message: "Passwords must be identical."})
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await groupsModel.create({name, password:hashedPassword, description, groupTeacher: decodedDataId});

        res.status(200).json({result: "Successful"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const editGroup = async (req, res) => {
    const { groupId, prevName, name, password, confirmPassword, description } = req.body;

    try {
        const existingGroup = await groupsModel.findOne({_id: groupId});
        if(!existingGroup) return res.status(404).json({ message: "This group doesn't exist."});

        if(password !== confirmPassword) return res.status(406).json({ message: "Passwords must be identical."})
        const hashedPassword = await bcrypt.hash(password, 12);

        await groupsModel.findByIdAndUpdate({"_id": groupId}, {name, password:hashedPassword, description});
        await usersModel.updateMany({"groups.name": prevName},{$set:{"groups.$.name": name}}, {multi:true})

        res.status(200).json({result: "Successful"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const deleteGroup = async (req, res) => {

    const { groupData:{ groupId } } = req.body;
    try {
        const existingGroup = await groupsModel.findById(groupId);
        if(!existingGroup) return res.status(404).json({ message: "This group doesn't exist."});

        await groupsModel.deleteOne( {_id: groupId});
        await usersModel.updateMany({"groups.name": existingGroup.name},{$pull:{groups:{name: existingGroup.name}}})
        
        res.status(200).json({ result: "Group Deleted!" })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const joinGroup = async (req, res) => {
    const { name, password } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;

    try {
        const existingGroup = await groupsModel.findOne({ name });
        if (!existingGroup) return res.status(404).json({ message: "Invalid Credentials."})

        const isPasswordCorrect = await bcrypt.compare(password, existingGroup.password)
        if(!isPasswordCorrect) return res.status(404).json({ message: "Invalid Credentials."})

        const user = await usersModel.findOne({_id: decodedDataId});
        for(var i = 0;i<user.groups.length;i++){
            if (user.groups[i].name === name){
                return res.status(404).json({ message: "You are already a part of this group."})
            }
        }

        await usersModel.findByIdAndUpdate(decodedDataId, { $push: {groups:{name}}});

        res.status(200).json({result: "Successful"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}
export const adminJoinGroup = async (req, res) => {
    const {groupName } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;
    
    try {
        const existingGroup = await groupsModel.findOne({ name:groupName });
        if (!existingGroup) return res.status(404).json({ message: "Invalid Credentials."})

        const user = await usersModel.findOne({_id: decodedDataId});
        for(var i = 0;i<user.groups.length;i++){
            if (user.groups[i].name === groupName){
                return res.status(404).json({ message: "You are already a part of this group."})
            }
        }

        await usersModel.findByIdAndUpdate(decodedDataId, { $push: {groups:{name:groupName}}});

        res.status(200).json({result: "Successful"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const leaveGroup = async (req, res) => {
    const { groupName } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;

    let check = false
    try {
        const user = await usersModel.findOne({_id: decodedDataId});
        for(var i = 0;i<user.groups.length;i++){
            if (user.groups[i].name === groupName){
                check = true
            }
        }
        if (check === false) return res.status(404).json({ message: "You are not a part of this group."})

        await usersModel.updateOne( {"_id": decodedDataId}, { $pull: {groups: {name: groupName}}});

        res.status(200).json({result: "Successful"})
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }
}