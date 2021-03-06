const request = require('request-promise-native');
const logger = require("../config/logger");

module.exports = function getProfile(accessToken) {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                url: 'https://kapi.kakao.com/v2/user/me',
                method: 'GET',
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
                reject(error);
            }
        );
    });
}

module.exports = function getfriendList(accessToken) {
    return new Promise((resolve, reject) => {
        request(
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                url: 'https://kapi.kakao.com/v1/api/talk/friends',
                method: 'GET',
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
                reject(error);
            }
        );
    });
}