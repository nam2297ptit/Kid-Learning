import React from "react";
import Notification from "../../components/Notification";
import { Col, Container, Row } from "reactstrap";
import LoadingSprinner from "../../components/LoadingSprinner";
import SubjectDetails from "./SubjectDetails/SubjectDetails";
import ProfActivities from "./profile-activities/ProfActivities";
import { isEmpty } from "../../utils/ValidInput";
import Page404 from "../auth/Page404";
const api = require("./api/api");

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkMainAcc: window.location.search.substring(7, window.location.search.length),
            loadApiGetUser: false,
            notFound: false,
        };
    }

    componentDidMount() {
        // api.getUserInfo(this.state.checkMainAcc, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.data._error_message,
        //         );
        //     } else {
        //         if (isEmpty(result)) this.setState({ notFound: true, loadApiGetUser: true });
        //         this.setState({
        //             data: result,
        //             loadApiGetUser: true,
        //         });
        //     }
        // });
    }

    render() {
        const url = window.location.search;
        if (url.substring(7, url.length) !== this.state.checkMainAcc) window.location.reload();
        return (
            <React.Fragment>
                <SubjectDetails data={this.state.data} />
            </React.Fragment>
        );
    }
}

export default Profile;
