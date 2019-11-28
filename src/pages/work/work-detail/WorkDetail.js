import React from "react";
import { Link } from "react-router-dom";
import "./WorkDetail.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faPlus, faAngleDown, faAngleRight, faTrash, faStar, faEye } from "@fortawesome/free-solid-svg-icons";
import { PlusCircle, MoreHorizontal, Trash, Save, EditRounded, Star, Eye } from "react-feather";

import Tasks from "./CardLeft/Tasks";
import CustomAttachments from "./CardLeft/CustomAttachments";
import Actions from "./CardLeft/Actions";
import Financial from "./CardRight/Financial";
import WorkInfo from "./CardRight/WorkInfo";

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardSubtitle,
    Table,
    Input,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Progress,
    Badge,
    ListGroup, ListGroupItem,
} from "reactstrap";
import Notification from "../../../components/Notification";
import { ModalAssignUser, ModalConfirm } from "../../../components/Modal";
import { CustomImg, LoadingSprinner, Attachments, Description } from "../../../components/CustomTag";

const ValidInput = require("../../../utils/ValidInput")
const api = require("./api/api");
const utils = require("../../../utils/utils");

const work_id = window.location.search
    .slice(1)
    .split("&")
    .map(p => p.split("="))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).id;

class CardLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                project: {},
            },

            edit_subject: false,
            remove: false,
            handleupdate: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data,
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
            api.modifyWork(work_id, { subject: subject, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            });
        }
    }

    handleRemove() {
        api.removeWork(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                window.location.replace("/project/work");
            }
        });
    }

    handleChangeDescription(description) {
        if (description !== this.state.data.description) {
            api.modifyWork(work_id, { description: description, version: this.state.data.version }, (err, result) => {
                if (err) {
                    Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
                } else {
                    Notification("success");
                    this.props.handleUpdateData(result);
                }
            });
        }
    }

    render() {
        const { memberInProject } = this.props;
        return (
            <React.Fragment>
                <ModalConfirm isOpen={this.state.remove} handleOk={this.handleRemove.bind(this)} handleCancel={this.toggle.bind(this, "remove")} />
                <Card className='card-left'>
                    <CardHeader className='my-0'>
                        {/* <div className='card-actions float-right'>
                            <UncontrolledDropdown>
                                <DropdownToggle tag='a'>
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.toggle.bind(this, "remove")}>
                                        <Trash />
                                        &nbsp;Deletework
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div> */}
                        <Row>
                            <Col className='width-percent-30'>
                                {this.state.edit_subject ? (
                                    <React.Fragment>
                                        <div className='d-flex'>
                                            <Input id='work-input-subject' type='text' defaultValue={this.state.data.subject} onKeyUp={this.handleOnKeyUp.bind(this)} />
                                            <Save className='feather-md m-1 cursor-pointer' color='black' onClick={this.handleSave.bind(this)} />
                                        </div>
                                        <h4 className='text-success'># {this.state.data.project.subject}</h4>
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <h2>
                                                {this.state.data.subject} <FontAwesomeIcon icon={faPen} size='sm' className='mr-1 cursor-pointer' onClick={this.toggle.bind(this, "edit_subject")} />
                                            </h2>
                                            <h4 className='text-success'># {this.state.data.project.subject}</h4>
                                        </React.Fragment>
                                    )}
                            </Col>
                            <Col className='d-flex justify-content-end pt-2'>
                                <div>
                                    <p className='my-0 pr-2 pt-1'> Created by: {this.state.data.owner.full_name} </p>
                                    <p className='my-0 pr-2 d-flex justify-content-end'> Create date: {moment(this.state.data.created_date).format("DD/MM/YYYY")}</p>
                                </div>
                                <Link to='#' activeclassname='active'>
                                    <CustomImg key={utils.randomString()} src={this.state.data.owner.photo} alt='avatar' className='rounded-circle img--user--square-3x' />
                                </Link>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Description description={this.state.data.description} handleSave={this.handleChangeDescription.bind(this)} />
                            </Col>
                        </Row>

                        <Row className='mt-3 row-task'>
                            <Col>
                                <Tasks memberInProject={memberInProject} />
                            </Col>
                        </Row>

                        <Row className='mt-3 row-attachments'>
                            {/* <Col>
                                <CustomAttachments memberInProject={memberInProject} />
                            </Col> */}
                        </Row>
                        <Row className='mt-3 row-actions'>
                            <Col>
                                <Actions data={this.state.handleupdate} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
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
                owner: {},
                project: {},
                description: "",
                assigned_users: [],
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

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
        console.log(event.target.name, event.target.value);
    }

    deleteAssignUser(id, assign_name) {
        if (assign_name === "assign_user") {
            let data = utils.copyState(this.state.data);
            data.assigned_users.splice(id, 1)
            api.modifyWork(work_id, {
                assigned_users: data.assigned_users,
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
            api.modifyWork(work_id, { watchers: data.watchers, version: this.state.data.version }, (err, result) => {
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
        api.modifyWork(work_id, {
            assigned_users: id,
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
        api.modifyWork(work_id, { watchers: id, version: this.state.data.version }, (err, result) => {
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
        api.modifyWork(work_id, { due_date: due_date, version: this.state.data.version }, (err, result) => {
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
        api.modifyWork(work_id, { status: status, version: this.state.data.version }, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                Notification("success");
                this.props.handleUpdateData(result);
            }
        });
    }

    render() {
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
                        <Star size={30} className='mr-1 cursor-pointer text-warning d-inline float-right' />
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
                            mode={"multiple"}
                            userSelected={this.state.data.assigned_users}
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

class WorkDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                owner: {},
                project: {},
                description: "",
                assigned_users: [],
                watchers: [],
                due_date: null,
                isLoadedInfoProject: false,
                isLoadedWorkDetail: false,
            },
            data_user: [],
            data_watcher: [],
            memberInProject: [],
            project: {},
        };
    }

    componentDidMount() {
        const that = this;
        let state = utils.copyState(this.state)
        api.getWorkDetail(work_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                throw err;
            } else {
                result.description = result.description_html;
                state.data = result;
                state.data.isLoadedWorkDetail = true;
                api.getInfoProject((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
                    } else {
                        let watchers = state.data.watchers;
                        state.project = result;
                        state.data.isLoadedInfoProject = true;
                        state.memberInProject = result.members;
                        if (!ValidInput.isEmpty(state.data.assigned_users)) {
                            state.data_user = state.memberInProject.filter(function (itm) {
                                return state.data.assigned_users.indexOf(itm.id) > -1;
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
        state.data_user = state.memberInProject.filter(function (itm) {
            return (data.assigned_users.indexOf(itm.id) > -1);
        });
        state.data.isLoadedInfoProject = true;
        state.data.isLoadedWorkDetail = true;
        this.setState(state)
    }

    render() {
        const { project, isLoadedInfoProject, isLoadedWorkDetail, data } = this.state;
        const memberInProject = project.members;
        return (
            this.state.data.isLoadedInfoProject === true && this.state.data.isLoadedWorkDetail === true ? (
                <Container fluid className='WorkDetail'>
                    <Row>
                        <Col xl={8}>
                            <CardLeft
                                handleLoading={this.props.handleLoading}
                                data={data} memberInProject={memberInProject}
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
                </Container>
            ) : (
                    <LoadingSprinner />
                )
        );
    }
}

export default WorkDetail;
