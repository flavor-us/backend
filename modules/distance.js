exports.addDistanceElements = function (list, defaultPoint) {
    list = list.map((item) => {
        item.dataValues.distance = Math.abs(Number(item.dataValues.lat) - defaultPoint[0] + Number(item.dataValues.lng) - defaultPoint[1]);
        return item.dataValues;
    });
    return (list)
}

exports.sortListByDistance = function (list) {
    list = list.sort((a, b) => {
        return a.distance - b.distance
    });
    return list;
}

exports.getMeterDistance = async function (lat1, lat2, lng1, lng2) {
    var distance = Math.round(Math.sqrt(Number(Number(Math.pow(lat1 - lat2, 2)).toFixed(8)) + Number(Number(Math.pow(lng1 - lng2, 2)).toFixed(8))) * 100000);
    if (distance > 1000)
        distance = Math.ceil((distance / 1000) * 10) / 10 + "k";
    return (distance + "m");
}