const db = require('../../models');
const nameModule = require('../../modules/getName');
var ExifImage = require('exif').ExifImage;
require("dotenv").config();
const models = require('../../models');

exports.getNames = async ( req, res ) => {
    let moe = 0.00001; //1m 반경
    var names;
    const Op = models.Sequelize.Op;
    function getExif(file) {
        return new Promise(function (resolve, reject) {
            try {
                new ExifImage({ image : file }, function (error, exifData) {
                    if (error)
                        reject(console.log('Error: '+ error.message));
                    else
                        resolve([ exifData.gps.GPSLatitude ,exifData.gps.GPSLongitude ]);
                });
            } catch (error) {
                reject(console.log('Error: ' + error.message));
            }
        })
    }

    async function getNameSequelize (lat, lng, moe) {
        const names = await models.Location.findAll({
            attributes : ['name', 'lat', 'lng'],
            where : {
                lat : { [Op.between] : [ lat - moe, lat + moe ] },
                lng : { [Op.between] : [ lng - moe, lng + moe ] }
            }
        })
        return names;
    }
    
    // names = getNameSequelize();
    console.log(names);
    // function getName(Query, lat, lng) {
    //     return new Promise(function(resolve, reject) {
    //         db.all(Query, [
    //             lat - moe,
    //             lat + moe,
    //             lng - moe,
    //             lng + moe
    //             ], (err, rows) => {      
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 resolve(rows);
    //                 reject(rows);
    //             }
    //         )
    //     })
    // }

    function convertLatLng (lat_DMS, lng_DMS){
        if (lat_DMS && lng_DMS)
        {
            const lat_Degree = lat_DMS[0] + lat_DMS[1]/60 + lat_DMS[2]/3600;
            const lng_Degree = lng_DMS[0] + lng_DMS[1]/60 + lng_DMS[2]/3600;
            return ([lat_Degree, lng_Degree])
        }
        else
            return (null);
    }

    const gpsDMS = await nameModule.getExif(req.file.path)
    .catch(function (error) {
        console.log(error);
    });
    if (gpsDMS)
    {
        console.log(gpsDMS)
        const gpsDegree = nameModule.convertLatLng(gpsDMS[0], gpsDMS[1]);
        console.log(gpsDegree);
        if (gpsDegree)
        { 
            do {
                // names = await getName(selectNameQuery, gpsDegree[0], gpsDegree[1]);
                names = await nameModule.getNameSequelize( gpsDegree[0], gpsDegree[1], moe);
                console.log(names);
                console.log(moe);
                moe *= 2
                if (moe > 0.01) // 1km
                    break ;
            } while ( Object.keys(names).length < 3 )

            nameArray = names.map((item) => {
                return item.dataValues;
            })

            console.log(nameArray)
            res.render('admin/select.html', { nameArray : nameArray }); //web
            // res.send({ name : nameArray }); //android
            // res.send({ name });
        } else {
            res.send( {
                name: [ "Not Found" ],
                msg: "EXIF 데이터가 있으나, 위도 경도 정보는 찾을 수 없었습니다."
            } )
        }
    }
    else
         res.send( {
                msg: "Cannot get ExifData"
         } )
}

exports.showMap =  async (req, res) => {
    console.log(req.query);
    res.render('admin/name.html', { name : req.query.name , lat : req.query.lat , lng : req.query.lng , KakaoApikey : process.env.KAKAO_KEY });
}
