import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const SomethingSchema = new Schema({});

const Something = model('Something', SomethingSchema);

export default Something;
