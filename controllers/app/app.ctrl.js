const nameModule = require('../../modules/getName');
require("dotenv").config();

exports.getNames = async ( req, res ) => {
    let moe = 0.00001; //1m 반경
    var names;
    const gpsDMS = await nameModule.getExif( req.file.path )
    .catch(function (error) {
        console.log(error);
    });
    if (gpsDMS)
    {
        const gpsDegree = nameModule.convertLatLng( gpsDMS[0], gpsDMS[1] );
        if (gpsDegree)
        { 
            do {
                names = await nameModule.getNameSequelize( gpsDegree[0], gpsDegree[1], moe );
                moe *= 2
                if (moe > 0.01) // 1km
                    break ;
            } while ( Object.keys(names).length < 3 )
            nameArray = names.map((item) => {
                return item.dataValues;
            })
            res.send({ name : nameArray });
        } else {
            res.send({
                name: [ "Not Found" ],
                msg: "EXIF 데이터가 있으나, 위도 경도 정보는 찾을 수 없었습니다."
            })
        }
    }
    else
         res.send({
                msg: "Cannot get ExifData"
         })
}

exports.showMap =  async (req, res) => {
    res.render('admin/name.html', { name : req.query.name , lat : req.query.lat , lng : req.query.lng , KakaoApikey : process.env.KAKAO_KEY });
}
