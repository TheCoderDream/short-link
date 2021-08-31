const mongoose = require('mongoose');
const utils = require('../utils')

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        unique: true,
    },
    shortenUrl : {
        type: String,
        unique: true,
        default: () => utils.getShortenUrl(utils.generateNewURLStub())
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

const URLModel = new mongoose.model('URL', URLSchema);

module.exports = URLModel;