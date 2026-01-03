import mongoose from 'mongoose';
const { Schema } = mongoose;

const ContactSchema = new Schema({
    userId: { type: Number, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

export { Contact };