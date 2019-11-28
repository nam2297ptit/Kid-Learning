import React from "react";
import { connect } from "react-redux";
import {
    Container,
    Col, Row,
    Card, CardHeader, CardBody, CardTitle,
    Media,
} from "reactstrap";
import './index.css';
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import { randomString } from "../../utils/utils";
import Notification from "../../components/Notification";
import { Link } from "react-router-dom";

const api = require("./api/api");
const none = "none";

class WorkonWorking extends React.Component {
    constructor(props) {
        super(props);
        const { user_id } = this.props;
        this.state = {
            user_id: user_id
        };
        this.handleSelectWork.bind(this);
    }

    handleSelectWork(id_project, id_work) {
        api.getInfoProject(id_project, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member
                }
                sessionStorage.setItem('project', JSON.stringify(project));
                window.location.replace("/project/work?id=" + id_work);
            }
        });
    }
    render() {
        return (
            this.props.work_data.filter((value) => value.assigned_users.indexOf(this.state.user_id) !== -1 || value.owner.id === this.state.user_id)
                .map(({ id, owner, project, subject }) => {
                    return (
                        <Card key={randomString()} className="shadow-lg">
                            <div onClick={() => this.handleSelectWork(project.id, id)} className="cursor-pointer full-width">
                                <CardHeader className="dashboard__subCard__title text-color-black p-2">
                                    <b className="mt-auto">
                                        {subject}
                                    </b>
                                </CardHeader>
                            </div>
                            <CardBody className="text-color-black p-1">
                                <Media>
                                    <CustomImg className="img--user--square-3x rounded mt-auto mr-2 mb-auto ml-1" src={project === null ? none : project.logo} />
                                    <div>
                                        <p className="mb-0">
                                            <b>Owner: </b>{owner === null ? <i>none</i> : owner.full_name}
                                        </p>
                                        <hr className="mt-1 mb-1" />
                                        <p className="mb-0">
                                            <b>Project: </b>{project === null ? <i>none</i> : project.subject}
                                        </p>
                                    </div>
                                </Media>
                            </CardBody>
                        </Card>
                    )
                }
                )
        )
    }
}

class TaskonWorking extends React.Component {
    constructor(props) {
        super(props);
        const { user_id } = this.props;
        this.state = {
            user_id: user_id
        };
        this.handleSelectTask.bind(this);
    }
    handleSelectTask(id_project, id_task) {
        api.getInfoProject(id_project, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member
                }
                sessionStorage.setItem('project', JSON.stringify(project));
                window.location.replace("project/work/task?id=" + id_task);
            }
        });
    }
    render() {
        return (
            this.props.task_data.filter((value) => {
                if (value.assigned_to !== null) {
                    return value.assigned_to.id === this.state.user_id
                }
                else return value.owner.id === this.state.user_id
            })
                .map(({ id, assigned_to, work, project, subject }) => (
                    <Card key={randomString()} className="shadow-lg">
                        <div onClick={() => this.handleSelectTask(project.id, id)} className="cursor-pointer full-width">
                            <CardHeader className="dashboard__subCard__title text-color-black p-2">
                                <b>
                                    {subject}
                                </b>
                            </CardHeader>
                        </div>
                        <CardBody className="text-color-black p-1">
                            <Media>
                                <CustomImg className="img--user--square-3x rounded mt-auto mr-2 mb-auto ml-1" src={project === null ? none : project.logo} alt="avt" />
                                <div>
                                    <p className="mb-0">
                                        <b>Assigned to: </b>{assigned_to === null ? <i>none</i> : assigned_to.full_name}
                                    </p>
                                    <hr className="mt-1 mb-1" />
                                    <p className="mb-0">
                                        <b>Project: </b>{project === null ? <i>none</i> : project.subject}
                                    </p>
                                    <hr className="mt-1 mb-1" />
                                    <p className="mb-0">
                                        <b>Work: </b>{work === null ? <i>none</i> : work.subject}
                                    </p>
                                </div>
                            </Media>
                        </CardBody>
                    </Card>
                )
                )
        )
    }
}

class Watching extends React.Component {
    constructor(props) {
        super(props);
        const { user_id } = this.props;
        this.state = {
            user_id: user_id
        };
        this.handleSelectWork.bind(this);
    }

    handleSelectWork(id_project, id_work) {
        api.getInfoProject(id_project, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member
                }
                sessionStorage.setItem('project', JSON.stringify(project));
                window.location.replace("/project/work?id=" + id_work);
            }
        });
    }
    render() {
        return (this.props.watch_data.map(({ id, project, subject, status }) => (
            <Card key={randomString()} className="shadow-lg">
                <div onClick={() => this.handleSelectWork(project.id, id)} className="cursor-pointer full-width">
                    <CardHeader className="dashboard__subCard__title text-color-black p-2">
                        <b className="mt-auto">
                            {subject}
                        </b>
                    </CardHeader>
                </div>
                <CardBody className="text-color-black p-1">
                    <Media>
                        <CustomImg className="img--user--square-3x rounded mt-auto mr-2 mb-auto ml-1" src={project === null ? none : project.logo} alt="avt" />
                        <div>
                            <p className="mb-0">
                                <b>Project: </b>{project === null ? <i>none</i> : project.subject}
                            </p>
                            <hr className="mt-1 mb-1" />
                            <p className="mb-0">
                                <b>Status: </b>{status === null ? <i>none</i> : status}
                            </p>
                        </div>
                    </Media>
                </CardBody>
            </Card>
        )
        )
        )
    }
}

class Default extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            work_data: [],
            task_data: [],
            watch_data: [],
            loaded: 0
        }
    }
    componentDidMount() {
        const { user } = this.props;
        let id = user.user.id;        
        const that = this;

        api.getWorks((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                that.setState({ work_data: result, loaded: this.state.loaded + 1 });
            }
        })

        api.getTasks((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                that.setState({ task_data: result, loaded: this.state.loaded + 1 });
            }
        })

        api.getWatchs(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                that.setState({ watch_data: result, loaded: this.state.loaded + 1 });
            }
        })
    }
    render() {
        const { user } = this.props;
        let UserId = user.user.id; 
        return (
            (this.state.loaded === 3) ?
                <Container fluid className="p-0 dashboard__container">
                    <Row className="row flex-nowrap">
                        <Col lg="4" className="min-width-2x">
                            <Card>
                                <div className="dashboard__card">
                                    <CardHeader className="dashboard__card__header text-white text-center pt-2 pb-2 rounded">
                                        <CardTitle className="dashboard__card__title m-auto">
                                            <b>WORKS ON WORKING</b>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody className="pb-1">
                                        <WorkonWorking work_data={this.state.work_data} user_id={this.props.user.user.id} />
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                        <Col lg="4" className="min-width-2x">
                            <Card>
                                <div className="dashboard__card">
                                    <CardHeader className="dashboard__card__header text-white text-center pt-2 pb-2 rounded">
                                        <CardTitle className="dashboard__card__title m-auto">
                                            <b>TASKS ON WORKING</b>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody className="pb-1">
                                        <TaskonWorking task_data={this.state.task_data} user_id={this.props.user.user.id} />
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                        <Col lg="4" className="min-width-2x">
                            <Card>
                                <div className="dashboard__card">
                                    <CardHeader className="dashboard__card__header text-white text-center pt-2 pb-2 rounded">
                                        <CardTitle className="dashboard__card__title m-auto">
                                            <b>WATCHING</b>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody className="pb-1">
                                        <Watching watch_data={this.state.watch_data} user_id={this.props.user.user.id} />
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                :
                <LoadingSprinner />
        );
    }
}

export default connect(
    store => ({
        user: store.user
    })
)(Default);
