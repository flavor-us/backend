const logger = require("../../../config/logger");

exports.foodOrNot = function (rekog) {
    for (var i = 0; i < rekog.Labels.length; i++) {
        if (rekog.Labels[i].Name == "Food") {
            if (rekog.Labels[i].Confidence < 85)
                return (false);
            else
                return (true);
        }
    }
    return (false);
}