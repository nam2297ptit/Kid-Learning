import { combineReducers } from "redux";

import sidebar from "./sidebarReducers";
import layout from "./layoutReducer";
import theme from "./themeReducer";

import user from "./userReducer";

export default combineReducers({
    sidebar,
    layout,
    theme,
    user,
});
