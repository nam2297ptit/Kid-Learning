import React from "react";
import Routes from "./routes/Routes";
import { connect } from "react-redux";
function App() {
    return (
        <React.Fragment>
            <Routes />
        </React.Fragment>
    );
}

export default connect()(App);
