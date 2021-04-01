import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true },
    groupTeacher: { type: mongoose.Types.ObjectId,ref: 'users' },
    quizzes:[
        {
            _id: mongoose.Types.ObjectId,
            name: String,
            tier: Number,
            category: String,
            multiple: Boolean,
            questions:[
                {
                    _id: mongoose.Types.ObjectId,
                    title: String,
                    question: String,
                    correctAnswer: String,
                    answer1: String,
                    answer2: String,
                    answer3: String,
                    answer4: String
                }
            ],
            usersAttempted:[
                {
                    _id: { type: mongoose.Types.ObjectId, ref: 'users' },
                    userEmail: String,
                    correctAnswers: Number,
                    wrongAnswers: Number,
                    answers: [
                        {
                            _id: false,
                            questionTitle: String,
                            correctAnswer: String,
                            usersAnswer: String
                        }
                    ]
                }
            ],
            creationDate: {
                type: Date,
                default: new Date()
            }
        }
    ],
    creationDate: {
        type: Date,
        default: new Date()
    }
});

const groups = mongoose.model('groups', userSchema);

export default groups;