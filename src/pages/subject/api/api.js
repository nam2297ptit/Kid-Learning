const config_api = require("../../../config/config").config_api.subject;
const utils = require("../../../utils/utils");
const axios = require("axios");

function getListSubject(callback) {
    axios({
        url: config_api.list_subject,
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

function getInfoProject(id, callback) {
    /* Check valid input */
    let id_project;
    if (id === "this") {
        id_project = utils.getProjectId();
    } else {
        id_project = id;
    }

    axios({
        url: config_api.project + "/" + id_project,
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

function createSubject(data, callback) {
    axios({
        url: config_api.list_subject,
        method: "POST",
        headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
            name: data.name,
            description: data.description,
            image: data.file,
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
    getListSubject: getListSubject,
    getInfoProject: getInfoProject,
    createSubject: createSubject,
    getRoleInProject: getRoleInProject,
};
