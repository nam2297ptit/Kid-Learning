const config_api = require("../../../config/config").config_api.subject;
const utils = require("../../../utils/utils");
const axios = require("axios");

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

function editSubject(id, data, callback) {
    axios({
        url: config_api.list_subject + "/" + id,
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: data,
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
function deleteSubject(data, callback) {
    axios({
        url: config_api.list_subject + "/" + JSON.parse(localStorage.getItem("subject")).id,
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
    getInfoSubject: getInfoSubject,
    editSubject: editSubject,
    deleteSubject: deleteSubject,
};
