const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const SomethingSchema = new Schema({});

const Something = model('Something', SomethingSchema);

module.exports = Something;
