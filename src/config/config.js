const api_path = `${process.env.REACT_APP_API_PATH}/api/v1/`;

const config_api = {
    auth: {
        signin: api_path + "auth",
        register: api_path + "auth/register",
        verify: api_path + "auth/verify",
        forgot_password: api_path + "auth/create_new_pass",
        user: api_path + "users",
    },
};

module.exports = {
    config_api: config_api,
};
