const config_api = require("../../../config/config").config_api;
const utils = require("../../../utils/utils");
const axios = require("axios");

function getFileOfWorkAndTask(callback) {
    axios({
        url: config_api.task_attachments,
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response);
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message);
            }
        });
}
function getFileOfWiki(callback) {
    axios({
        url: config_api.wiki_attachments,
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response);
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message);
            }
        });
}
module.exports = {
    getFileOfWorkAndTask: getFileOfWorkAndTask,
    getFileOfWiki: getFileOfWiki,
};
