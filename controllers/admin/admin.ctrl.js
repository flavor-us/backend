const db = require('../../models');
var ExifImage = require('exif').ExifImage;

exports.getName = async ( req, res ) => {
    console.log("Post")
    let moe = 0.00001;
    var name;
    const selectNameQuery = `SELECT name FROM LocationDB
                WHERE 
                    lat BETWEEN ? AND ? and
                    lng BETWEEN ? AND ?`
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

    function getName(Query, lat, lng) {
        return new Promise(function(resolve, reject) {
            db.all(Query, [
                lat - moe,
                lat + moe,
                lng - moe,
                lng + moe
                ], (err, rows) => {      
                    if (err) {
                        throw err;
                    }
                    resolve(rows);
                    reject(rows);
                }
            )
        })
    }

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

    const gpsDMS = await getExif(req.file.path)
    .catch(function (error) {
        console.log(error);
    });
    if (gpsDMS)
    {
        console.log(gpsDMS)
        const gpsDegree = convertLatLng(gpsDMS[0], gpsDMS[1]);
        console.log(gpsDegree);
        if (gpsDegree)
        { 
            do {
                name = await getName(selectNameQuery, gpsDegree[0], gpsDegree[1]);
                console.log(moe);
                moe *= 2;
                if (moe > 0.01)
                    break ;
            } while ( Object.keys(name).length < 3 )
            console.log(name);
            console.log(gpsDegree)
            // res.render('admin/select.html', { name , gpsDegree }); // web
            res.send({ name : name }); //  android
        }
    }
    else
        res.send("Error : Can't get ExifData")
}

exports.showMap =  async (req, res) => {
    console.log(req.params);
    res.render('admin/name.html', { name : req.query.name , lat : req.query.lat , lng : req.query.lng });
}