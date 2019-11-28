import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Media, Badge } from "reactstrap";
//img
import { CustomImg, LoadingSprinner } from "./CustomTag";
const utils = require("../utils/utils");
const ValidInput = require("../utils/ValidInput");

class ContentActivities extends React.Component {
    constructor(props) {
        super(props);
    }

    //Ham xu ly api
    renderDataEventType(data) {
        let buffer = [];
        if (data.diff_values.attachments !== undefined) {
            if (!ValidInput.isEmpty(data.diff_values.attachments.new)) {
                buffer.push(
                    <div key={utils.randomString()}>
                        <Badge color="primary" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                            new attachments
                    </Badge>
                        <span className="Timeline___linkto pl-2">{data.diff_values.attachments.new.subject}</span>
                    </div>
                );
            }

            if (!ValidInput.isEmpty(data.diff_values.attachments.deleted)) {
                buffer.push(
                    <div key={utils.randomString()}>
                        <Badge color="primary" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                            deleted attachments
                    </Badge>
                        <span className="Timeline___linkto pl-2">{data.diff_values.attachments.deleted.subject}</span>
                    </div>
                );
            }
        }

        if (data.diff_values.description !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        description
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.description[0] + " => " + data.diff_values.description[1]}</span>
                </div>
            );
        }

        if (data.diff_values.assigned_users !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        assigned user
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.assigned_users[0] + " => " + data.diff_values.assigned_users[1]}</span>
                </div>
            );
        }
        if (data.diff_values.status !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        status
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.status[0] + " => " + data.diff_values.status[1]}</span>
                </div>
            );
        }
        if (data.diff_values.tags !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        tags
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.tags[0] + " => " + data.diff_values.tags[1]}</span>
                </div>
            );
        }
        if (data.diff_values.subject !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        subject
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.subject[0] + " => " + data.diff_values.subject[1]}</span>
                </div>
            );
        }
        if (data.diff_values.due_date !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        due_date
                    </Badge>
                    <span className="Timeline___linkto pl-2">
                        {moment(data.diff_values.due_date[0]).format("DD MMM YYYY hh:mm") +
                            " => " +
                            moment(data.diff_values.due_date[1]).format("DD MMM YYYY hh:mm")}
                    </span>
                </div>
            );
        }
        if (data.diff_values.type !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        type
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.type[0] + " => " + data.diff_values.type[1]}</span>
                </div>
            );
        }
        if (data.diff_values.severity !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        due_date
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.severity[0] + " => " + data.diff_values.severity[1]}</span>
                </div>
            );
        }
        if (data.diff_values.priority !== undefined) {
            buffer.push(
                <div key={utils.randomString()}>
                    <Badge color="info" className="pt-1 aria-label " style={{ fontSize: 13 }}>
                        due_date
                    </Badge>
                    <span className="Timeline___linkto pl-2">{data.diff_values.priority[0] + " => " + data.diff_values.priority[1]}</span>
                </div>
            );
        }
        return buffer;
    }

    render() {
        const height_comment = window.screen.height * 0.3;
        let actions = this.props.dataActivities.map((data, index) => {
            const linkUser = `/profile${`?email=${data.user.email}`}`;
            return (
                <div key={index}>
                    <Media>
                        {/* img */}
                        <Link to={linkUser} activeclassname="active" className="pt-2">
                            <CustomImg key={utils.randomString()} src={data.user.photo} alt="avatar" className="rounded-circle img--user--square-3x" />
                        </Link>
                        {/* content */}
                        <Media body className="p-1 ml-3">
                            <strong>
                                <Link to={linkUser} activeclassname="active" className="Activities___linkto text-success">
                                    {data.user.full_name}
                                </Link>{" "}
                            </strong>
                            {moment.utc(data.created_date).format("DD MMM YYYY hh:mm")}
                            <br />
                            <div>{this.renderDataEventType(data)}</div>
                        </Media>
                    </Media>
                    <hr />
                </div>
            );
        });
        return (
            <React.Fragment>
                <div
                    className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x"
                    style={{ maxHeights: height_comment, minHeight: 10 }}
                    id="message"
                    onLoad={this.scrollToBottom}
                >
                    {actions}
                </div>
            </React.Fragment>
        );
    }
}

class Activities extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderAPI: false
        };
    }
    componentDidMount() {
        if (this.props.dataActivities !== undefined) {
            this.setState({
                dataActivities: this.props.dataActivities,
                isLoaderAPI: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataActivities !== undefined) {
            this.setState({
                dataActivities: nextProps.dataActivities,
                isLoaderAPI: true
            });
        }
    }

    render() {
        return (
            <React.Fragment>{!this.state.isLoaderAPI ? <LoadingSprinner /> : <ContentActivities dataActivities={this.state.dataActivities} />}</React.Fragment>
        );
    }
}

export default Activities;
