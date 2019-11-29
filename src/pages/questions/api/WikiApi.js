const config_api = require("../../../config/config").config_api;
const utils = require("../../../utils/utils");
const axios = require("axios");

//hàm lấy thông tin Danh sách các wiki
function getTimeline(callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url: config_api.path + "wiki?project=",
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}

//hàm tạo mới wiki
function CreateWiki(data, callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url: config_api.path + "wiki",
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {
            subject: data,
            project: utils.getProjectId(),
        },
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}

//hàm xóa wiki
function DeleteWiki(id, callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url: config_api.path + "wiki/" + id,
        method: "DELETE",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}
//ham sua noi dung cmt
function EditWikiDes(description, callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url: config_api.path + "wiki/" + utils.getWikiId(),
        method: "PATCH",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {
            content: description,
            version: utils.getWikiVersion(),
        },
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}
// hàm lấy Ra lịch sử của wiki
function getWikiHistory(id, callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url:
            config_api.path + "history/wiki/" + id + "?page=1&type=activity&order_by=-created_date",
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}
//hàm lấy danh sách file
function getListAttachments(callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url:
            config_api.path +
            "wiki/attachments?object_id=" +
            utils.getWikiId() +
            "&project=" +
            utils.getProjectId(),
        method: "GET",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}
//xóa file đính kèm
function DeleteFile(id, callback) {
    // nếu không có tham số đầu vào bỏ input
    axios({
        url: config_api.path + "wiki/attachments/" + id,
        method: "DELETE",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: {},
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}
//
//Add file
function Addfile(file, callback, process) {
    const data = new FormData();
    data.append("project", utils.getProjectId());
    data.append("object_id", utils.getWikiId());
    data.append("attached_file", file);
    data.append("from_comment", false);
    axios({
        url: config_api.path + "wiki/attachments",
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
        data: data,
        onUploadProgress: ProgressEvent => {
            return process(((ProgressEvent.loaded / ProgressEvent.total) * 100) | 0);
        },
    })
        .then(result => {
            return callback(false, result.data);
        })
        .catch(error => {
            if (error.response) {
                // Lỗi khi server nhận được request và không xử lý được, các lỗi này có mã lỗi ngoài dải 2xx
                return callback(error.response);
            } else if (error.request) {
                // Lỗi khi request được tạo ra nhưng server không hồi đáp, vd : net::ERR_CONNECTION_TIMED_OUT
                return callback("Please check your internet connection to server");
            } else {
                console.log(error.message);
                // Lỗi khi thiết lập request status
                return callback(error.message);
            }
        });
}

module.exports = {
    getTimeline: getTimeline,
    CreateWiki: CreateWiki,
    DeleteWiki: DeleteWiki,
    EditWikiDes: EditWikiDes,
    getWikiHistory: getWikiHistory,
    getListAttachments: getListAttachments,
    DeleteFile: DeleteFile,
    Addfile: Addfile,
};
