const config_api = require("../../config/config").config_api;
const utils = require("../../utils/utils");
const axios = require("axios");

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
      "Content-type": "application/json"
    },
    data: {}
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
  getInfoProject: getInfoProject
};
