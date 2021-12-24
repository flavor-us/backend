const nameModule = require("../../../modules/getName");
const errorMsg = require("../../../message/error");
const deleteFileModule = require("../../../modules/deleteFile");

exports.getNames = async (req, res) => {
    var restData, restList, moe = 0.00004; // 약 4m 반경
    try {
        if (!req.file)
            throw (errorMsg.notEnoughReq);
        const gpsDMS = await nameModule.getExif(req.file.path);
        if (!gpsDMS) {
            throw (errorMsg.noLatLng);
        }
        if (gpsDMS) {
            const gpsDegree = nameModule.convertLatLng(gpsDMS[0], gpsDMS[1]);
            do {
                restList = await nameModule.getNearRestaurants(gpsDegree[0], gpsDegree[1], moe);
                moe *= 4;
                if (moe > 0.001) // 약 100m
                    break;
            } while (Object.keys(restList).length < 3);
            restData = restList.map((item) => {
                return item.dataValues;
            });
            if (restData.length == 0)
                throw (errorMsg.noRestaurants);
        }
    } catch (e) {
        console.log(e);
        if (e == errorMsg.noLatLng)
            return (res.status(400).send(errorMsg.noLatLng));
        if (e == errorMsg.noRestaurants)
            return (res.status(400).send(errorMsg.noRestaurants));
        else
            return (res.status(400).send(errorMsg.readFail));
    } finally {
        deleteFileModule.deleteFile(req.file.path);
    }
    return (res.status(200).json({ restData: restData }));
}