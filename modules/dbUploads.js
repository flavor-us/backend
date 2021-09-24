const models = require('../models');

exports.uploadContent = async function(content){
    await models.Contents.create(content);
}