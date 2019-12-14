const config_api = require("../../../config/config").config_api.questions;
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
function createQuestion(data, callback) {
    axios({
        url: config_api.questions,
        method: "POST",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
            subjectId: JSON.parse(localStorage.getItem("subject")).id,
            quizId: localStorage.getItem("quiz"),
            linkImage: data.linkImage,
            linkVideo: null,
            content: data.content,
            result: data.result,
            key: null,
            solution: data.solution,
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

function editQuiz(data, callback) {
    axios({
        url: config_api.list_quizz + "/" + localStorage.getItem("quiz"),
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
            name: data.name,
            timeTest: parseInt(data.timeTest),
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

function deleteQuiz(callback) {
    axios({
        url: config_api.list_quizz + "/" + localStorage.getItem("quiz"),
        method: "DELETE",
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

function deleteQuestion(i, callback) {
    axios({
        url: config_api.questions + "/" + i,
        method: "DELETE",
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

module.exports = {
    getListQuiz: getListQuiz,
    editQuiz: editQuiz,
    createQuestion: createQuestion,
    deleteQuiz: deleteQuiz,
    deleteQuestion: deleteQuestion,
};
