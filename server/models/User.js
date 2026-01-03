import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: null },
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

export { User};