import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0, required: true },
    groups: [
        {
            name: { type: String,  ref: 'groups' }
        }
    ],
    type: {
        type: String,
        enum: ['Admin', 'Regular'],
        default: 'Regular', 
        required: true
    },
    /*MemorableWord: {type: String, required: true},*/
    banned: {
        isBanned: { type: Boolean, default: false }
    },
    quizAttempted: [
        {
            _id:{ type: mongoose.Types.ObjectId, ref: 'groups' },
        }
    ],
    creationDate: { type: Date, default: new Date() },
});

const users = mongoose.model('users', userSchema);

export default users;