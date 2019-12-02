const config_api = require("../../../config/config").config_api.quizz;
const utils = require("../../../utils/utils");
const axios = require("axios");

function getListQuiz(id, callback) {
    axios({
        url: config_api.list_quizz,
        method: "GET",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
            subjectId: id,
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

function getInfoSubject(id, callback) {
    /* Check valid input */
    let id_subject;
    if (id === "this") {
        id_subject = JSON.parse(localStorage.getItem("subject")).id;
    } else {
        id_subject = id;
    }

    axios({
        url: config_api.list_subject + "/" + id_subject,
        method: "GET",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
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

function createQuiz(data, callback) {
    console.log(data);

    axios({
        url: config_api.list_quizz,
        method: "POST",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
            subjectId: JSON.parse(localStorage.getItem("subject")).id,
            name: data.name,
            timeTest: data.time,
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

function getRoleInProject(id, callback) {
    axios({
        url: config_api.roles,
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            project: id,
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

module.exports = {
    getListQuiz: getListQuiz,
    getInfoSubject: getInfoSubject,
    createQuiz: createQuiz,
    getRoleInProject: getRoleInProject,
};
