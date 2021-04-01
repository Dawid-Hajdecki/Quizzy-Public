import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import groupsModel from '../models/groupsModel.js';
import usersModel from '../models/usersModel.js';

dotenv.config();

export const getQuizzes = async (req, res) => {
    const {groupId} = req.body

    try {
        const result = await groupsModel.findOne({_id: groupId});

        res.status(200).json({result});
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
}

export const getQuiz = async (req, res) => {
    const { groupId, quizId } = req.body
    try {
        const result = await groupsModel.findOne({"_id": groupId, "quizzes._id": quizId}, {quizzes:{$elemMatch:{"_id": quizId}}});

        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const addQuiz = async (req, res) => {
    const { groupId, name, tier, category, multiple } = req.body;
    const _id = new mongoose.Types.ObjectId();

    try {
        const existingGroup = await groupsModel.findOne({_id: groupId});
        if(!existingGroup) return res.status(404).json({ message: "This group doesn't exist."});

        await groupsModel.findByIdAndUpdate({"_id": groupId}, { $push:{quizzes: { _id, name, tier, category, multiple}}});
        res.status(200).json({ message: 'Successful' })
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const editQuiz = async (req, res) => {
    const { groupId, id, name, tier, category, multiple } = req.body;

    try {
        const existingQuiz = await groupsModel.findOne({_id: groupId},{quizzes:{$elemMatch:{_id: id}}});
        if(!existingQuiz) return res.status(404).json({ message: "This quiz doesn't exist."});

        await groupsModel.updateOne({"_id": groupId, "quizzes._id": id},{$set:{"quizzes.$.name": name, "quizzes.$.tier": tier, "quizzes.$.category": category,  "quizzes.$.multiple": multiple}})
        res.status(200).json({ message: 'Successful' });
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const deleteQuiz = async (req, res) => {
    const {groupData} = req.body
    try {
        const existingQuiz = await groupsModel.findOne({_id: groupData.groupId},{quizzes:{$elemMatch:{_id: groupData.quizId}}});
        if(!existingQuiz) return res.status(404).json({ message: "This quiz doesn't exist."});

        await groupsModel.updateOne( {"_id": groupData.groupId}, { $pull: {quizzes: {_id: groupData.quizId}}});

        res.status(200).json({ message: 'Successful' })
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const finishQuiz = async (req, res) => {
    const { quizData:{groupId, quizId, userEmail, questionsCorrect, questionsWrong} } = req.body;
    const { answers } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedDataId = jwt.verify(token, process.env.JWT_VERIFY).id;
    let newScore = 0;
    let isLeader = false;
    let result;
    let addAttempt = true;
    
    try {
        const existingQuiz = await groupsModel.findOne({_id: groupId},{quizzes:{$elemMatch:{_id: quizId}}});
        if(!existingQuiz) return res.status(404).json({ message: "This quiz doesn't exist."});

        const quiz = await groupsModel.findOne({_id: groupId, "quizzes._id": quizId},{quizzes:{$elemMatch:{_id: quizId}}});
        console.log(quiz.quizzes[0].multiple)
        if(existingQuiz.quizzes[0].multiple == false){

            const user = await usersModel.findOne({_id:decodedDataId, "quizAttempted._id": quizId}, {quizAttempted:{$elemMatch:{_id:quizId}}})
            if(user != null){addAttempt = false}
        }
        if(addAttempt == true){

            result = await groupsModel.updateOne({
                "_id": groupId,
                "quizzes._id": quizId,
            }, 
            {
                $push:{
                    "quizzes.$.usersAttempted":{
                        _id:            decodedDataId,
                        userEmail,
                        correctAnswers: questionsCorrect,
                        wrongAnswers:   questionsWrong,
                        answers
                    }
                }
            });
        
            const checkGroupLeader = async () => {
                const groupTeacher = await groupsModel.findById(groupId).select('groupTeacher');

                if(groupTeacher.groupTeacher == decodedDataId) isLeader = true;
            }
            
            const score = await usersModel.findById(decodedDataId).select('score');
            const calculateScore = () => {
                newScore += score.score
                if(questionsWrong === 0) newScore += 100
                newScore += questionsCorrect*10
                newScore -= questionsWrong*10
            }
            
            const addScore = async () => {
                await usersModel.updateOne({_id: decodedDataId}, {$set:{score: newScore}}) 
            }

            checkGroupLeader();
            if(!isLeader && result.nModified == 1){
                calculateScore();
                addScore();
            } 
        }
        console.log(quizId)
        console.log(decodedDataId)
        await usersModel.findByIdAndUpdate(decodedDataId, { $addToSet: {quizAttempted:{"_id": quizId}}});

        res.status(200).json({ message: 'Successful' })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }
}

export const getQuestions = async (req, res) => {
    /* const {groupId, quizId} = req.body;

    try {
        const result = await groupsModel.findOne({_id: groupId, "quizzes._id": quizId},{quizzes:{$elemMatch:{_id: quizId}, 'quizzes.questions': ""}});
        if(!result) return res.status(404).json({ message: "This quiz doesn't exist."});
        
        res.status(200).json({ result })
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    } */
}

export const addQuestion = async (req, res) => {
    const { groupId, quizId, title, question, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3} = req.body;
    let answers = [correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3]

    const _id = new mongoose.Types.ObjectId()
    
    answers = answers.sort(() => Math.random() -0.5);
    const answer1 = answers[0], answer2 = answers[1], answer3 = answers[2], answer4 = answers[3]

    try {
        const quiz3 = await groupsModel.findOne({_id: groupId, "quizzes._id": quizId},{quizzes:{$elemMatch:{_id: quizId}}})
        if(!quiz3) return res.status(404).json({ message: "This quiz doesn't exist."});

        await groupsModel.updateOne({"_id": groupId, "quizzes._id": quizId}, {$push:{ "quizzes.$.questions":{_id, title, question, correctAnswer, answer1, answer2, answer3, answer4}}});

        res.status(200).json({ message: 'Successful' })
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
        console.log(error)
    }
}

export const editQuestion = async (req, res) => {
/*    const { groupId, quizId, questionId, title, question, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3 } = req.body;

    try {
        const quiz3 = await groupsModel.findOne({"_id": groupId, "quizzes._id": quizId, "quizzes.questions._id": questionId}, {"quizzes":{$elemMatch:{"questions._id": questionId}}});
        if(!quiz3) return res.status(404).json({ message: "This question doesn't exist."});

        const result = await groupsModel.updateOne({"_id": groupId, "quizzes._id": quizId, "quizzes.questions._id": questionId},{questions:{$set:{"questions.$.title": title}}});
        //{$set:{"quizzes.$.name": name, "quizzes.$.tier": tier, "quizzes.$.category": category}})
        console.log(result)
        res.status(200).json({ quiz3 })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong.", error});
    }*/
}

export const deleteQuestion = async (req, res) => {
    const {groupData:{groupId, quizId, questionId}} = req.body;

      try {
        await groupsModel.updateOne({"_id": groupId, "quizzes._id": quizId, "quizzes.questions._id": questionId},{$pull:{ "quizzes.$.questions":{ _id: questionId}}});

        res.status(200).json({ message: 'Successful' })
    } catch (error) {
        res.status(500).json({message: "Something went wrong.", error});
    }  
}