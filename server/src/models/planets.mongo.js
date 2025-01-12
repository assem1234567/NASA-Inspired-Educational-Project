const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
}); // لا تقوم بتعطيل strict mode

module.exports = mongoose.model('Planet', planetSchema);
