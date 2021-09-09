const db = require('../../models');
const {readFile} = require('fs').promises;
const EXIF = require('exif-js');
// console.log (models);
//req.body.lat & req.body.lng
exports.get_name = async ( req, res ) => {
    let moe = 0.0000001;
    var name_list;
    console.log(req.body.photo)
    // const Op = db.Sequelize.Op;
    
    // const name = await Promise.all([
    //     db.InfoPk.findByPk(1)
    //     // db.InfoPk.findOne ({
    //     //     where : {
    //     //         lat : {
    //     //             [Op.gte] : req.body.lat - moe,
    //     //             [Op.lte] : req.body.lat + moe
    //     //         },
    //     //         lng : {
    //     //             [Op.gte] : req.body.lng - moe,
    //     //             [Op.lte] : req.body.lng + moe
    //     //         }
    //     //     }
    //     // })
    // ])
//     EXIF.getData(, function() {
//         var make = EXIF.getTag(this, "Make"); //"Make" 항목만 확인
//         console.log( make );
//         var allMetaData = EXIF.getAllTags(this); //모든 EXIF정보
//         console.log( JSON.stringify(allMetaData, null, "\t") );
//    });
//     (async () => {
//         const exif = getExif(await readFile('../../uploads/foods.jpeg')).Exif;
       
//         // 33434: ID of the `ExposureTime` tag
//         exif['33434']; //=> [1, 100]
       
//         // 36867: ID of the `DateTimeOriginal` tag
//         exif['36867']; //=> '2017:11:19 08:47:19'
//       })();
    // let selectNameQuery = `SELECT name FROM InfoPk
    //             WHERE 
    //                 lat >= ? and lat <= ? and 
    //                 lng >= ? and lat <= ?`
    // var searchDB = function () { db.all(selectNameQuery, [
    //     req.body.lat - moe,
    //     req.body.lat + moe,
    //     req.body.lng - moe,
    //     req.body.lng + moe
    //     ], (err, rows) => {      
    //         if (err) {
    //             throw err;
    //         }
    //         console.log(4);
    //         return (rows)
    //         // name_list =  JSON.parse(JSON.stringify(rows))
    //     }
    // )}
    // moe *= 5;
    console.log(1);
    // db.serialize( () => {
    //     console.log(searchDB())
    //     console.log(3)
    // })
    console.log(2)
}