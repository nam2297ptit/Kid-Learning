const config_api = require("../../../config/config").config_api.quizz;
const utils = require("../../../utils/utils");
const axios = require("axios");

function getListQuiz(id, callback) {
    axios({
        url: config_api.list_quizz + "/" + id,
        method: "GET",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
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

function getInfoProject(callback) {
    axios({
        url: config_api.project + "/" + utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
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
    getListQuiz: getListQuiz,
    getInfoProject: getInfoProject,
};
