

exports.addDistanceElements = function (restList, defaultPoint) {
    restList = restList.map((item) => {
        item.dataValues.distance = Math.abs(Number(item.dataValues.lat) - defaultPoint[0] + Number(item.dataValues.lng) - defaultPoint[1]);
        return item.dataValues;
    });
    return (restList)
}

exports.sortRestaurantList = function (restList) {
    restList = restList.sort((a, b) => {
        return a.distance - b.distance
    });
    return restList;
}