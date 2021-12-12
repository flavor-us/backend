const nameModule = require("../../../modules/getName");
const errorMsg = require("../../../message/error");

exports.getNames = async (req, res) => {
    let moe = 0.00001; //10m 반경
    var names;
    var gpsDMS;
    if (req.file) {
        console.log(req.file)
        var gpsDMS = await nameModule.getExif(req.file.path).catch(function (error) {
            console.log(error);
            res.status(400).send(errorMsg.readFail);
        });
    } else {
        res.status(400).send(errorMsg.noFile);
    }
    if (gpsDMS) {
        const gpsDegree = nameModule.convertLatLng(gpsDMS[0], gpsDMS[1]);
        if (gpsDegree) {
            do {
                names = await nameModule.getNameSequelize(gpsDegree[0], gpsDegree[1], moe);
                moe *= 4;
                if (moe > 0.005)
                    // 500m
                    break;
            } while (Object.keys(names).length < 3);
            restData = names.map((item) => {
                return item.dataValues;
            });
            res.status(200).json({ restData: restData });
        } else {
            res.status(400).send(errorMsg.noLatLng);
        }
    } else
        res.status(400).send(errorMsg.noLatLng);
};