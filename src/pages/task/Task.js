import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    MoreHorizontal, Trash, Star, Upload
} from "react-feather"

import Comment from "../../components/Comment";
import {
    Container, Row, Col,
    Card, CardHeader, CardTitle, CardBody, CardSubtitle,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ListGroup, ListGroupItem,
    FormGroup, Label, Progress
} from "reactstrap"
import { ModalAssignUser, ModalConfirm } from "../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description, Notification } from "../../components/CustomTag";
import Activities from "../../components/Activities";
import moment from "moment";
const api = require("./api/api");
const utils = require("../../utils/utils");
const ValidInput = require("../../utils/ValidInput");

class Actions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "comments",
            total_comment: 0,
            dataComment: [],
            total_activities: 0,
            dataActivities: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle(component) {
        this.setState({ show: component })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data === true) {
            let state = Object.assign({}, this.state);
            api.getActivities(state.task_id, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    state.total_activities = result.length;
                    state.dataActivities = result;
                    this.setState(state)
                }
            })
        }
    }

    componentDidMount() {
        let state = Object.assign({}, this.state);
        api.getComment(state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.total_comment = result.length;
                state.dataComment = result;
                this.setState(state)
            }
        })

        api.getActivities(state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.total_activities = result.length;
                state.dataActivities = result;
                this.setState(state)
            }
        })
    }

    handleSubmit(data_comment) {
        let state = Object.assign({}, this.state);
        const that = this;
        // post_comment
        api.sendComment(state.task_id, data_comment, function (err, result) {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.total_comment = result.total_comments;
                //get_comment
                api.getComment(state.task_id, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        state.dataComment = result;
                        that.setState(state)
                    }
                })
            }
        });
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <div
                        className={"float-left " + (this.state.show === "comments" ? "border-bottom font-weight-bold" : "")}
                        onClick={this.toggle.bind(this, "comments")}
                    >
                        <a>{this.state.total_comment} comments</a>
                    </div>
                    <div
                        className={"ml-3 float-left " + (this.state.show === "activities" ? "border-bottom font-weight-bold" : "")}
                        onClick={this.toggle.bind(this, "activities")}>
                        <a>{this.state.total_activities} activities</a>
                    </div>
                </CardHeader>
                <CardBody>
                    {
                        this.state.show === "comments"
                            ?
                            <Comment
                                handleSubmit={this.handleSubmit.bind(this)}
                                dataComment={this.state.dataComment}
                            /> :
                            <Activities
                                dataActivities={this.state.dataActivities}
                            />
                    }
                </CardBody>
            </Card>
        )
    }
}

class CustomAttachments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            percentage: 0,
            data: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
    }

    componentDidMount() {
        api.getAttachmentsOfTask(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                this.setState({
                    data: result,
                    isLoaded: true
                })
            }
        })
    }

    handleRemoveFile(id) {
        api.removeAttachments(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                let data = utils.copyState(this.state.data);
                let index = data.findIndex({ id: id });
                data.splice(index, 1);
                this.setState({ data: data });
            }
        })
    }

    handleUploadFile(file) {
        let that = this;
        var listFile = utils.copyState(this.state.data)
        api.postAttachments(this.state.task_id, file, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                listFile.push(result);
                this.setState({
                    data: listFile
                })
                Notification("success");
            }
        }
            , (process) => {
                this.setState({
                    percentage: process
                });
            })
    }

    render() {
        return (
            <Attachments
                isLoaded={this.state.isLoaded}
                progress={this.state.percentage}
                data={this.state.data}
                handleRemoveFile={this.handleRemoveFile.bind(this)}
                handleSelectFile={this.handleUploadFile.bind(this)}
            />
        )
    }
}

class CardLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_subject: false,
            remove: false,
            handleupdate: false,
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data,
                handleupdate: true
            };
        }
        else {
            return { handleupdate: false };
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component]
        })
    }

    handleOnKeyUp(event) {
        if (event.key === "Enter") {
            this.toggle("edit_subject");
            this.handleSave();
        }

        if (event.key === "Escape") {
            this.toggle("edit_subject");
        }
    }

    handleSave() {
        this.toggle("edit_subject");
        let subject = document.getElementById("work-input-subject").value;
        if (subject !== this.state.data.subject) {
            api.modifyTask(this.state.task_id, { subject: subject, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    handleRemove() {
        api.removeTask(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                window.location.replace("/project/work")
            }
        })
    }

    handleChangeDescription(description) {
        if (description !== this.state.data.description_html) {
            api.modifyTask(this.state.task_id, { description: description, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    render() {
        console.log("render Card-Left")
        return (
            <>
                <ModalConfirm
                    isOpen={this.state.remove}
                    handleOk={this.handleRemove.bind(this)}
                    handleCancel={this.toggle.bind(this, "remove")}
                />
                <Card className="card-left">
                    <CardHeader>
                        <div className="card-actions float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle tag="a">
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.toggle.bind(this, "remove")}><Trash />&nbsp;Delete
                                        work</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        <CardTitle>
                            <div className="width-percent-80">
                                {
                                    this.state.edit_subject
                                        ?
                                        <div className="d-flex">
                                            <Input
                                                id="work-input-subject"
                                                type="text"
                                                defaultValue={this.state.data.subject}
                                                onKeyUp={this.handleOnKeyUp.bind(this)}
                                            />
                                            <FontAwesomeIcon icon={faSave} className="ml-2 cursor-pointer"
                                                onClick={this.handleSave.bind(this)} />
                                        </div>
                                        :
                                        <div>
                                            <span>{this.state.data.subject}</span>
                                            <span>
                                                <FontAwesomeIcon icon={faPen} className="ml-2 cursor-pointer"
                                                    onClick={this.toggle.bind(this, "edit_subject")} />
                                            </span>
                                        </div>
                                }
                            </div>
                        </CardTitle>
                        <CardSubtitle>#{utils.ValidInput.isEmpty(this.state.data.project) ? null : this.state.data.project.subject}</CardSubtitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Description
                                    description={this.state.data.description_html}
                                    handleSave={this.handleChangeDescription.bind(this)}
                                />
                            </Col>
                        </Row>

                        <Row className="mt-3 row-attachments">
                            {/* <Col>
                                <CustomAttachments />
                            </Col> */}
                        </Row>
                        <Row className="mt-3 row-actions">
                            <Col>
                                <Actions data={this.state.handleupdate} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </>
        )
    }
}

class ItemListGroup extends React.Component {
    constructor(props) {
        super(props);
        const { data, index } = this.props;
        this.state = {
            isHover: false,
            data: data,
            index: index
        }
    }

    deleteAssignUser() {
        this.props.deleteAssignUser(this.props.data.id, this.props.assign_name)
    }

    render() {
        return (
            <ListGroupItem
                key={this.state.index}
                onMouseOver={() => this.setState({ isHover: true })}
                onMouseLeave={() => this.setState({ isHover: false })}
                action
                className="cursor-grab full-width"
            >
                {
                    !this.state.isHover ?
                        <div>
                            <CustomImg
                                key={utils.randomString()}
                                src={this.state.data.photo}
                                className='mt-1 mb-1 ml-1 mr-3 img--user--square-2x rounded-circle hover-color'
                            />
                            {this.state.data.full_name}
                        </div>
                        :
                        <div className="d-flex justify-content-between">
                            <div>
                                <CustomImg
                                    key={utils.randomString()}
                                    src={this.state.data.photo}
                                    className='mt-1 mb-1 ml-1 mr-3 img--user--square-2x rounded-circle hover-color'
                                />
                                {this.state.data.full_name}
                            </div>
                            <div className="align-self-center">
                                <Trash color="red" onClick={() => this.deleteAssignUser()} className="cursor-pointer full-width" />
                            </div>
                        </div>
                }
            </ListGroupItem>
        )
    }
}

class CardRight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                description: "",
                subject: "",
                project: {},
                assigned_to: null,
                watchers: [],
                due_date: null,
                version: 1
            },
            handleupdate: false,
            assign_user: false,
            assign_watcher: false,
            display_User: true,
            display_Watcher: true,
            isHover: false,
            isEditDueDate: false,
            isAddWatcherMe: false,
            members: [],
            data_user: [],
            data_watcher: [],
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data,
                data_user: props.data_user,
                members: props.members,
                data_watcher: props.data_watcher,
                handleupdate: true,
            };
        } else {
            return { handleupdate: false };
        }
    }

    toggle(component) {
        this.setState({
            [component]: !this.state[component],
        });
    }

    upgradeTaskToWork() {
        api.upgradeTaskToWork(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                window.location.replace("./");
            }
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
        console.log(event.target.name, event.target.value);
    }

    deleteAssignUser(id, assign_name) {
        if (assign_name === "assign_user") {
            api.modifyTask(this.state.task_id, {
                assigned_to: null,
                version: this.state.data.version
            }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
        else {
            let data = utils.copyState(this.state.data);
            data.watchers.splice(id, 1);
            api.modifyTask(this.state.task_id, { watchers: data.watchers, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            })
        }
    }

    handleAssignUser(id) {
        this.toggle('assign_user');
        api.modifyTask(this.state.task_id, {
            assigned_to: id[0],
            version: this.state.data.version
        }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleAssignWatcher(id) {
        this.toggle('assign_watcher');
        api.modifyTask(this.state.task_id, { watchers: id, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleChangeDueDate(event) {
        let due_date = moment(event.target.value).format("MM/DD/YYYY");
        this.setState({ isEditDueDate: false });
        api.modifyTask(this.state.task_id, { due_date: due_date, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        })
    }

    handleChangeStatus(event) {
        let status = event.target.value;
        api.modifyTask(this.state.task_id, { status: status, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        });
    }

    render() {
        let assigned_to = [];
        if (!ValidInput.isEmpty(this.state.data.assigned_to)) {
            assigned_to.push(this.state.data.assigned_to);
        }
        else {
            assigned_to = [];
        }
        const height_assinged = window.screen.height * 0.2;
        return (
            <Card>
                <CardHeader>
                    <div>
                        <h4 className={"text-uppercase font-weight-bolder d-inline py-0 pr-2" + (utils.isExpired(this.state.data.due_date) ? " text-danger" : " text-success")}>
                            {utils.isExpired(this.state.data.due_date) ?
                                "Close" : "On Working"
                            }
                        </h4>
                        <Input
                            type='select'
                            name='status'
                            className='d-inline width-percent-30'
                            onChange={this.handleChangeStatus.bind(this)}
                            defaultValue={this.state.data.status}
                        >
                            <option>New</option>
                            <option>Ready</option>
                            <option>In Progress</option>
                            <option>Ready for test</option>
                            <option>Done</option>
                            <option>Archived</option>
                        </Input>
                        <Upload
                            size={30}
                            className='mr-1 cursor-pointer text-warning d-inline float-right'
                            onClick={this.upgradeTaskToWork.bind(this)}
                        />
                    </div>
                    <CardSubtitle className='mt-2 d-flex flex-row'>
                        Due date:{" "}
                        {this.state.isEditDueDate ? (
                            <Input
                                type='date'
                                name='due_date'
                                className='width-percent-40 d-inline'
                                onChange={this.handleChangeDueDate.bind(this)}
                                onKeyDown={e => e.preventDefault()}
                                defaultValue={this.state.due_date === null ? "" : this.state.data.due_date}
                            />
                        ) :
                            <div className={"width-percent-20 ml-2 d-flex flex-row" + (utils.isExpired(this.state.data.due_date) ? " text-decoration-line-through" : "")}>
                                {this.state.data.due_date !== null ? moment(this.state.data.due_date).format("DD/MM/YYYY") : "--/--/--"}
                                <FontAwesomeIcon icon={faPen} size='sm' className='ml-1 cursor-pointer' onClick={() => this.setState({ isEditDueDate: true })} />
                            </div>
                        }
                    </CardSubtitle>
                </CardHeader>
                <CardBody>
                    <div className='border-bottom'>
                        <Card body>
                            <CardHeader className="d-flex justify-content-between">
                                <CardTitle tag="h5" className="mb-0 py-2">
                                    Assigned to
								</CardTitle>
                                <Button className="mb-0" onClick={() => this.toggle('assign_user')}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    &nbsp;Add assigned to
                                </Button>
                            </CardHeader>
                            <ListGroup
                                className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x"
                                style={{ maxHeight: height_assinged, minHeight: 10 }}
                                flush
                            >
                                {
                                    this.state.data_user.map((value, index) => {
                                        return <ItemListGroup
                                            key={utils.randomString()}
                                            data={value}
                                            index={utils.randomString()}
                                            assign_name="assign_user"
                                            deleteAssignUser={this.deleteAssignUser.bind(this)}
                                        />;
                                    })
                                }
                            </ListGroup>
                        </Card>

                    </div>
                    <div
                        className='order-bottom'>
                        <Card body>
                            <CardHeader>
                                <CardTitle tag="h5" className="mb-0">
                                    Watchers
								</CardTitle>
                            </CardHeader>
                            <ListGroup
                                className="overflow-y-20x scrollbar-style-1 scrollbar-width-1x"
                                style={{ maxHeight: height_assinged, minHeight: 10 }}
                                flush
                            >
                                {
                                    this.state.data_watcher.map((value, index) => {
                                        return <ItemListGroup
                                            key={utils.randomString()}
                                            data={value}
                                            index={utils.randomString()}
                                            assign_name="assign_watcher"
                                            deleteAssignUser={this.deleteAssignUser.bind(this)}
                                        />;
                                    })
                                }
                            </ListGroup>
                            <CardBody className="d-flex justify-content-between" >
                                <Button
                                    className="width-percent-45"
                                    type='button'
                                    onClick={this.toggle.bind(this, "assign_watcher")}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    &nbsp;Add watcher
                                </Button>
                                {
                                    !this.state.isAddWatcherMe ?
                                        (<Button
                                            className="width-percent-45"
                                            type='button'
                                            onClick={this.toggle.bind(this, "isAddWatcherMe")}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            &nbsp;Watcher me
                                        </Button>) :
                                        (<Button
                                            className="width-percent-45"
                                            type='button'
                                            onClick={this.toggle.bind(this, "isAddWatcherMe")}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            &nbsp;Unwatcher me
                                        </Button>)
                                }
                            </CardBody>
                        </Card>
                    </div>
                    <div className='mt-3'>
                        <FormGroup>
                            <Label>Progress</Label>
                            <Progress animated value={20} color='primary' />
                        </FormGroup>
                    </div>
                    {/* <div className='mt-4 mb-3 border-bottom financial'>
                        <Financial />
                    </div> */}
                </CardBody>
                {
                    !ValidInput.isEmpty(this.state.members) ?
                        <ModalAssignUser
                            isOpen={this.state.assign_user}
                            allUsers={this.state.members}
                            mode={"single"}
                            userSelected={assigned_to}
                            handleSave={this.handleAssignUser.bind(this)}
                        />
                        :
                        null
                }
                {
                    !ValidInput.isEmpty(this.state.members) ?
                        <ModalAssignUser
                            isOpen={this.state.assign_watcher}
                            allUsers={this.state.members}
                            mode={"multiple"}
                            userSelected={this.state.data.watchers}
                            handleSave={this.handleAssignWatcher.bind(this)}
                        />
                        :
                        null
                }
            </Card>
        );
    }
}

class TaskDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                description: "",
                subject: "",
                project: {},
                assigned_to: null,
                watchers: [],
                due_date: null,
                isLoadedInfoProject: false,
                isLoadedWorkTask: false,
            },
            data_user: [],
            data_watcher: [],
            memberInProject: [],
            project: {},
            task_id: window.location.search
                .slice(1)
                .split('&')
                .map(p => p.split('='))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id
        }
    }

    componentDidMount() {
        const that = this;
        let state = utils.copyState(this.state)
        api.getTaskDetail(this.state.task_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                throw err;
            } else {
                result.description = result.description_html;
                state.data = result;
                state.data.isLoadedWorkTask = true;
                api.getInfoProject((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                    } else {
                        let watchers = state.data.watchers;
                        state.project = result;
                        state.data.isLoadedInfoProject = true;
                        state.memberInProject = result.members;
                        if (!ValidInput.isEmpty(state.data.assigned_to)) {
                            state.data_user = state.memberInProject.filter(function (itm) {
                                return state.data.assigned_to.indexOf(itm.id) > -1;
                            });
                        }
                        if (!ValidInput.isEmpty(state.data.watchers)) {
                            state.data_watcher = state.memberInProject.filter(function (value) {
                                return (watchers.indexOf(value.id) > -1);
                            });
                        }
                        that.setState(state);
                    }
                });
            }
        });
    }

    handleUpdateData(data) {
        let state = utils.copyState(this.state);
        state.data = data;
        state.data_watcher = state.memberInProject.filter(function (value) {
            return (data.watchers.indexOf(value.id) > -1);
        });
        if (data.assigned_to === null) {
            state.data_user = []
        } else {
            state.data_user = state.memberInProject.filter(function (itm) {
                return (data.assigned_to.indexOf(itm.id) > -1);
            });
        }
        state.data.isLoadedInfoProject = true;
        state.data.isLoadedWorkTask = true;
        this.setState(state)
    }

    render() {
        return (
            this.state.data.isLoadedWorkTask === true && this.state.data.isLoadedInfoProject === true ?
                (<Container fluid className="TaskDetail">
                    <Row>
                        <Col xl={8}>
                            <CardLeft
                                data={this.state.data}
                                handleUpdateData={this.handleUpdateData.bind(this)}
                            />
                        </Col>
                        <Col xl={4}>
                            <CardRight
                                data_user={this.state.data_user}
                                data_watcher={this.state.data_watcher}
                                members={this.state.memberInProject}
                                data={this.state.data}
                                handleUpdateData={this.handleUpdateData.bind(this)}
                            />
                        </Col>
                    </Row>
                </Container>) :
                (
                    <LoadingSprinner />
                )
        )
    }
}

export default TaskDetail;