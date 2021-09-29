const models = require('../../models');
const paginate = require('express-paginate');

exports.getContents = async (req, res) => {

    try{
        const [ contents , totalCount ] = await Promise.all([
           
            models.Contents.findAll(),
            models.Contents.count()
            
         ])
        res.render( 'admin/contents.html' , { contents , pageCount });

    }catch(e){

    }
}