const config_api = require("../../../config/config").config_api;
const axios = require("axios");

function ModalAPI_(url, method, headers, data, callback) {
    axios({
        url: url,
        method: method,
        withCredentials: true,
        headers: headers,
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
function getUserInfo(email, callback) {
    if (email === "" && window.location.search === "")
        ModalAPI_(
            config_api.path + "users/me",
            "GET",
            { "content-type": "application/json" },
            null,
            (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            },
        );
    else
        ModalAPI_(
            config_api.path + `users?email=${email}`,
            "GET",
            { "content-type": "application/json" },
            null,
            (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result[0]);
                }
            },
        );
}
function getContacts(id, callback) {
    ModalAPI_(
        config_api.user + `/${id}/contacts`,
        "GET",
        { "content-type": "application/json" },
        null,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}
function getWatched(id, callback) {
    ModalAPI_(
        config_api.path + `users/${id}/watched`,
        "GET",
        { "content-type": "application/json" },
        null,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}
function getProject(id, callback) {
    ModalAPI_(
        config_api.project + `?member=${id}`,
        "GET",
        { "content-type": "application/json" },
        null,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}

function updateUserInfo(id, data, callback) {
    ModalAPI_(
        config_api.path + `users/${id}`,
        "PATCH",
        { "content-type": "application/json" },
        data,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}

function updateAvatar(photo, callback) {
    ModalAPI_(
        config_api.path + "users/change_avatar",
        "POST",
        {},
        photo,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}

function changePassword(data, callback) {
    ModalAPI_(
        config_api.path + "users/change_password",
        "POST",
        {},
        data,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
}

function getTimeline(idLogin, id, callback) {
    // if (id === idLogin)
    ModalAPI_(
        config_api.path + `timeline/profile/${id}?order_by=-created_date`,
        "GET",
        { "content-type": "application/json" },
        null,
        (err, result) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result);
            }
        },
    );
    // else
    //     ModalAPI_(config_api.path+`timeline/user/${id}`, 'GET',{'content-type':'application/json'}, null, (err,result)=>{
    //             if(err) {return callback(err)}
    //             else {return callback(null, result)}
    //         }
    //     )
}
module.exports = {
    getUserInfo: getUserInfo,
    getContacts: getContacts,
    getWatched: getWatched,
    getProject: getProject,
    updateUserInfo: updateUserInfo,
    updateAvatar: updateAvatar,
    changePassword: changePassword,
    getTimeline: getTimeline,
};