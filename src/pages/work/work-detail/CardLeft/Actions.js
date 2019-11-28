import React from "react";
import Comment from "../../../../components/Comment";
import Activities from "../../../../components/Activities";
import { Card, CardHeader, CardBody } from "reactstrap";
import Notification from "../../../../components/Notification";

const api = require("../api/api");
const work_id = window.location.search
    .slice(1)
    .split("&")
    .map(p => p.split("="))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "comments",
            total_comment: 0,
            dataComment: [],
            total_activities: 0,
            dataActivities: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data === true) {
            let state = Object.assign({}, this.state);
            api.getActivities(work_id, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                } else {
                    state.total_activities = result.length;
                    state.dataActivities = result;
                    this.setState(state);
                }
            });
        }
    }

    componentDidMount() {
        let state = Object.assign({}, this.state);
        api.getComment(work_id, (err, result) => {
            if (err) {
                console.log(err);

                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                console.log(result);

                state.total_comment = result.length;
                state.dataComment = result;
                this.setState(state);
            }
        });

        api.getActivities(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                state.total_activities = result.length;
                state.dataActivities = result;
                this.setState(state);
            }
        });
    }

    handleSubmit(data_comment) {
        let state = Object.assign({}, this.state);
        const that = this;
        // post_comment
        api.sendComment(work_id, data_comment, function(err, result) {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                state.total_comment = result.total_comments;
                //get_comment
                api.getComment(work_id, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                    } else {
                        state.dataComment = result;
                    }
                    that.setState(state);
                });
            }
        });
    }

    toggle(component) {
        this.setState({ show: component });
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div className={"float-left " + (this.state.show === "comments" ? "border-bottom font-weight-bold" : "")} onClick={this.toggle.bind(this, "comments")}>
                        <a>{this.state.total_comment} comments</a>
                    </div>
                    <div className={"ml-3 float-left " + (this.state.show === "activities" ? "border-bottom font-weight-bold" : "")} onClick={this.toggle.bind(this, "activities")}>
                        <a>{this.state.total_activities} activities</a>
                    </div>
                </CardHeader>
                <CardBody>
                    {this.state.show === "comments" ? (
                        <Comment handleSubmit={this.handleSubmit.bind(this)} dataComment={this.state.dataComment} />
                    ) : (
                        <Activities dataActivities={this.state.dataActivities} />
                    )}
                </CardBody>
            </Card>
        );
    }
}
export default Actions;
