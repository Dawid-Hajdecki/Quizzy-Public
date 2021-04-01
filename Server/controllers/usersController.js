import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


import usersModel from '../models/usersModel.js';

dotenv.config();

export const getUser = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        let decodedData = jwt.verify(token, process.env.JWT_VERIFY)
        const user = await usersModel.findById(decodedData.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find({}).where('type').ne('Admin').select('name email banned.isBanned')
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error});
    }
}

export const checkIfBanned = async (req, res) => {
    try {
        const banned = await usersModel.find({email: req.body.email}).select('banned.isBanned')
        console.log(banned)
        res.status(200).json(banned);
    } catch (error) {
        res.status(404).json({ message: error});
    }
}

export const changeBanStatus = async (req, res) => {
    const {email, banned} = req.body
    try {
        if(banned){
            const a = await usersModel.updateOne({email}, {$set:{"banned.isBanned":false}})
        }else{
            const a = await usersModel.updateOne({email}, {$set:{"banned.isBanned":true}})
        }
        console.log(a)
        res.status(200).json({ message: "Successful"});
    } catch (error) {
        console.log()
        res.status(404).json({ message: error});
    }
}

export const changeProfileData = async (req, res) => {
    try {
        const existingUser = await usersModel.findById(req.body.userId);
        if(!existingUser) return res.status(404).json({ message: "User doesn't exists."})

        const isPasswordCorrect = await bcrypt.compare(req.body.password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials."})

        const returnUser = async () => {
            return res.status(200).json({message: "successful"});
        }

        switch (req.body.type){
            case 'name':
                await usersModel.updateOne({"_id": req.body.userId},{$set:{name:req.body.name}});
                returnUser();
                return;
            case 'email':
                const lowerCaseEmail = req.body.email.toLowerCase();
                await usersModel.updateOne({"_id": req.body.userId},{$set:{email:lowerCaseEmail}});
                returnUser();
                return;
            case 'password':
                const hashedPassword = await bcrypt.hash(req.body.oldPassword, 12);
                await usersModel.updateOne({"_id": req.body.userId},{$set:{password:hashedPassword}});
                returnUser();
                return;
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    try {
        const existingUser = await usersModel.findOne({ email:lowerCaseEmail});
        
        if(!existingUser ) return res.status(404).json({ message: "Invalid credentials."})
        else if(existingUser.banned.isBanned) return res.status(404).json({ message: "Sorry. This user is banned!"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials."})

        const user = await usersModel.findById(existingUser._id).select('-password');
        const token = jwt.sign({ email: user.email, id: user._id}, process.env.JWT_VERIFY, { expiresIn: "1h"})
        res.status(200).json({result: user, token})
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    }
}

export const register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    
    try {
        const existingUser = await usersModel.findOne({ email:lowerCaseEmail});
        if(existingUser) return res.status(404).json({ message: "User already exists."})
        
        if(password !== confirmPassword) return res.status(406).json({ message: "Passwords must be identical."})
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await usersModel.create({name, email:lowerCaseEmail, password: hashedPassword});
        const user = await usersModel.findById(result._id).select('-password');
        await usersModel.findByIdAndUpdate(result._id, { $push: {groups:{name: 'Main Group'}}});

        const token = jwt.sign({ email: user.email, id: user._id}, process.env.JWT_VERIFY, { expiresIn: "1h"});

        res.status(200).json({ result, token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong."});
    }
}