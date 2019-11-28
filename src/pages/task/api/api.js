const ModalAPI = require("../../../controller/ModalAPI").ModalAPI;
const utils = require("../../../utils/utils");
const config_api = require("../../../config/config").config_api;
const axios = require('axios');

function getTaskOfWork(id, callback) {
    axios({
        url: config_api.task + "?project=" + utils.getProjectId() + "&user_story=" + id,
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function getTaskDetail(id, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}
function upgradeTaskToWork(id, callback) {
    axios({
        url: config_api.task + "/" + id + "/upgrade_to_work",
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function createTask(id, data, callback) {
    axios({
        url: config_api.task,
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            project: utils.getProjectId(),
            user_story: id,
            subject: data.subject,
            assigned_to: data.assigned_to
        }
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function removeTask(id, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "DELETE",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function modifyTask(id, data, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "PATCH",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: data
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function getTaskStatus(callback) {
    axios({
        url: config_api.task_status + "?project=" + utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function postAttachments(id, file, callback, process) {
    const data = new FormData()
    data.append('project', utils.getProjectId())
    data.append('object_id', id)
    data.append('attached_file', file)
    axios({
        url: config_api + "tasks/attachments",
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
        data: data,
        onUploadProgress: ProgressEvent => {

            return process(ProgressEvent.loaded / ProgressEvent.total * 100 | 0)

        }
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

function getAttachmentsOfTask(id, callback) {
    axios({
        url: config_api.task_attachments + "?object_id=" + id + "&project=" + utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function removeAttachments(id, callback) {
    axios({
        url: config_api.task_attachments + "/" + id,
        method: "DELETE",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
        data: {}
    })
        .then(result => {
            return callback(false, result.data)
        })
        .catch(error => {
            if (error.response) {
                return callback(error.response)
            } else if (error.request) {
                return callback("Please check your internet connection to server");
            } else {
                return callback(error.message)
            }
        });
}

function getActivities(id, callback) {
    axios({
        url: config_api.task_actions + id + "?type=activity" + "&order_by=-created_date",
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        }
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
    /* Check valid input */
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
function getComment(id, callback) {
    axios({
        url: config_api.task_actions + id + "?type=comment",
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
            "x-disable-pagination": "1"
        }
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

function sendComment(id, data, callback) {
    axios({
        url: config_api.task + "/" + id,
        method: "PATCH",
        withCredentials: true,
        headers: {
            "Content-type": "application/json",
        },
        data: data
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
    getInfoProject: getInfoProject,
    getTaskDetail: getTaskDetail,

    getTaskOfWork: getTaskOfWork,

    createTask: createTask,
    removeTask: removeTask,
    modifyTask: modifyTask,
    getTaskStatus: getTaskStatus,
    upgradeTaskToWork: upgradeTaskToWork,

    removeAttachments: removeAttachments,
    postAttachments: postAttachments,
    getAttachmentsOfTask: getAttachmentsOfTask,

    getActivities: getActivities,
    getComment: getComment,
    sendComment: sendComment,
};