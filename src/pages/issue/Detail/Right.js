import React, { Component } from 'react';

import {
    Card, CardBody, CardHeader,
    ListGroup, ListGroupItem,
    Input, Label,
    DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown,
    FormGroup,
} from "reactstrap";
import { connect } from "react-redux"

import { ChevronDown, MoreHorizontal, Trash, LogOut, Plus } from 'react-feather'

import { CustomImg } from "../../../components/CustomTag"
import { ModalAssignUser, ModalConfirm, ModalAddTag, CircleCircle } from "../ModalIssue";

import Notification from "../../../components/Notification";
import utils from "../../../utils/utils"
import { moment } from 'fullcalendar';
const API = require("../api/api")
const ValidInput = require("../../../utils/ValidInput")
class Right extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: props.data.due_date,
            confirm: false,
            assign: false,
            data: props.data,
            assign_user: false,
            assign_watcher: false,
            description_html: this.props.data.description_html,
            idAssigned: [],
            dataChange: {},
            delete: false,
            addTag: false
        }
        this.toggle = this.toggle.bind(this)
    }
    componentWillMount() {

    }

    AssignTo() {
        this.setState({
            assign: !this.state.assign
        });
    }
    toggle(component) {
        if (this.props.permission) {
            this.setState({
                [component]: !this.state[component]
            })
        } else {
            Notification("warning", "Warning", "You need access permissions!")
        }

    }

    handleChangeDueDate(event) {
        let data = {
            due_date: event.target.value,
            version: this.props.data.version
        }
        if (this.props.permission) {
            this.setState({
                confirm: !this.state.confirm,
                dataChange: data
            })
        } else {
            Notification("warning", "Warning", "You need access permissions!")
        }

    }
    change(value, event) {
        let data = {
            [value]: event.target.value,
            version: this.props.data.version
        }
        if (this.props.permission) {
            this.setState({
                confirm: !this.state.confirm,
                dataChange: data
            })
        } else {
            Notification("warning", "Warning", "You need access permissions!")
        }

    }
    accept() {
        API.Update(this.props.idDetail, this.state.dataChange, (err, data) => {
            if (err) {
                this.setState({
                    confirm: !this.state.confirm,
                    dataChange: ""
                });
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    confirm: !this.state.confirm,
                    dataChange: ""
                });
                Notification("success");
                this.props.reLoad(this.props.idDetail);
                this.props.getActivity(this.props.idDetail)
            }
        })

    }
    reAsign(value) {
        let data = {
            assigned_to: value[0],
            version: this.props.data.version
        };
        API.Update(this.props.idDetail, data, (err, data) => {
            if (err) {
                this.setState({
                    assign_user: !this.state.assign_user,
                });
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    assign_user: !this.state.assign_user,
                });
                Notification("success");
                this.props.reLoad(this.props.idDetail);
                this.props.getActivity(this.props.idDetail)
            }
        })
    }
    AsignToMe() {
        if (!this.props.permission) {
            Notification("warning", "Warning", "You need access permissions!")
            return;
        }
        let data = {
            assigned_to: this.props.store.user.user.id,
            version: this.props.data.version
        };
        API.Update(this.props.idDetail, data, (err, data) => {
            if (err) {
                // this.setState({
                //     assign_user : !this.state.assign_user,
                // });
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                // this.setState({
                //     assign_user: !this.state.assign_user,
                // });
                Notification("success");
                this.props.reLoad(this.props.idDetail);
                this.props.getActivity(this.props.idDetail)
            }
        })
    }
    deleteIssue() {
        API.deleteIssue(this.props.idDetail, (err, data) => {
            if (err) {
                this.setState({
                    delete: !this.state.delete,
                });
                Notification("error", "Error", err.data === undefined ? err : err.status + " " + err.data._error_message);
            } else {
                this.setState({
                    delete: !this.state.delete,
                });
                Notification("success");
                this.props.Exit();
            }
        })

    }
    Addtag(value) {
        console.log(value)
    }
    render() {
        return (
            <Card >
                <CardHeader className="card-header-issue-detail">
                    <div className="pb-4 ">
                        <div className="card-actions float-right">
                            <UncontrolledDropdown>
                                <DropdownToggle tag="a">
                                    <MoreHorizontal />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    {this.props.permission ?
                                        <DropdownItem onClick={this.toggle.bind(this, "addTag")}>
                                            <Plus />&nbsp;Add tag
                                        </DropdownItem>
                                        : null}
                                    {this.props.permission ?
                                        <DropdownItem onClick={this.toggle.bind(this, "delete")}>
                                            <Trash />&nbsp;Delete work
                                        </DropdownItem>
                                        : null}
                                    <DropdownItem onClick={this.props.Exit.bind(this)}>
                                        <LogOut />&nbsp;Exit
                                        </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>

                </CardHeader>
                <CardBody>
                    <Label>Type</Label>
                    <ListGroup>
                        <ListGroupItem className="left_content hover-color" title={this.props.data.type} >
                            {this.props.permission ?
                                <div className="float-right">
                                    <UncontrolledDropdown  >
                                        <DropdownToggle tag="a">
                                            <ChevronDown className="issue-icon" />
                                        </DropdownToggle>
                                        <DropdownMenu right onClick={this.change.bind(this, "type")}>
                                            <DropdownItem value="Bug">Bug</DropdownItem>
                                            <DropdownItem value="Question">Question</DropdownItem>
                                            <DropdownItem value="Enhancement">Enhancement</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                : null}
                            <CircleCircle status={this.props.data.type} /> {this.props.data.type}
                        </ListGroupItem>

                    </ListGroup>
                </CardBody>

                <CardBody>
                    <Label>Severity</Label>
                    <ListGroup>
                        <ListGroupItem className="left_content hover-color" title={this.props.data.severity} >
                            {this.props.permission ?
                                <div className="float-right">
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="a">
                                            <ChevronDown className="issue-icon" />
                                        </DropdownToggle>
                                        <DropdownMenu right onClick={this.change.bind(this, "severity")}>
                                            <DropdownItem value="Withlist"> Withlist</DropdownItem>
                                            <DropdownItem value="Minor">Minor</DropdownItem>
                                            <DropdownItem value="Normal">Normal</DropdownItem>
                                            <DropdownItem value="Important">Important</DropdownItem>
                                            <DropdownItem value="Critical">Critical</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                : null}
                            <CircleCircle status={this.props.data.severity} /> {this.props.data.severity}
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>

                <CardBody>
                    <Label>Priority</Label>
                    <ListGroup>
                        <ListGroupItem className="left_content hover-color" title={this.props.data.priority}>
                            {this.props.permission ?
                                <div className="float-right">
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="a">
                                            <ChevronDown className="issue-icon" />
                                        </DropdownToggle>
                                        <DropdownMenu right onClick={this.change.bind(this, "priority")}>
                                            <DropdownItem value="Low">Low</DropdownItem>
                                            <DropdownItem value="Normal">Normal</DropdownItem>
                                            <DropdownItem value="High">High</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                                : null}
                            <CircleCircle status={this.props.data.priority} /> {this.props.data.priority}
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>
                <CardBody>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Status</Label>
                            <Input type="select" value={this.props.data.status} onChange={this.change.bind(this, "status")} disabled={!this.props.permission}>
                                <option >New</option>
                                <option >In Progess</option>
                                <option >Ready for test</option>
                                <option >Closed</option>
                                <option >Needs info</option>
                                <option >Rejected</option>
                                <option >Postponed</option>
                            </Input>
                        </FormGroup>
                    </div>
                </CardBody>
                <CardBody>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Due date</Label>
                            <Input type="date"
                                value={this.props.data.due_date}
                                onChange={this.handleChangeDueDate.bind(this)}
                                disabled={!this.props.permission} />
                        </FormGroup>
                    </div>
                </CardBody>
                <CardBody>
                    <div className="mt-3">
                        <FormGroup>
                            <Label>Assigned Users</Label>
                            <FormGroup>
                                <div>
                                    <div>
                                        <CustomImg
                                            key={1}
                                            src={ValidInput.isEmpty(this.props.data.photo) ? "" : this.props.data.photo}
                                            alt="avatar"
                                            className="rounded-circle img--user--square-2x ml-1 mt-1"
                                            title={ValidInput.isEmpty(this.props.data.full_name_display) ? "Not Assign" : this.props.data.full_name_display}
                                        />
                                    </div>

                                    <div className="mt-3" >
                                        <a className="font-size-1x"><span
                                            className="text-color-orange" onClick={this.toggle.bind(this, "assign_user")}>Assign</span> or <span
                                                className="text-color-orange" onClick={this.AsignToMe.bind(this)}>Assign to me</span></a>
                                    </div>
                                </div>
                            </FormGroup>
                        </FormGroup>
                    </div>
                </CardBody>
                <CardBody>
                    <Label>Owner</Label>
                    <div className="mt-0 row info_owner">
                        <div className="ml-3 overflow-y-20x scrollbar-style-1 scrollbar-width-1x width-percent-auto">
                                <strong>Created by:</strong> 
                                <a className ="a"
                                    href ={`/profile?email=${this.props.data.email}`}>
                                      {this.props.data.full_name_owner}
                                </a>
                            <div className ="time_create">{moment(this.props.data.created_date).format("DD MMM YYYY hh:mm")}</div>
                        </div>
                        <div className ="imgOwn">
                            <CustomImg
                                key={1}
                                src={this.props.data.photo_owner}
                                alt="avatar"
                                className="rounded-circle img--user--square-3x ml-2 mb-0"
                                title={this.props.data.full_name_owner}
                            />
                        </div>

                    </div>
                </CardBody>

                <ModalAssignUser
                    isOpen={this.state.assign_user}
                    allUsers={this.props.memberProject}
                    userSelected={[this.state.idAssigned[0]]}
                    mode="single"
                    handleSave={this.reAsign.bind(this)}
                    handleCancel={this.toggle.bind(this, "assign_user")} />

                <ModalConfirm
                    isOpen={this.state.confirm}
                    handleOk={this.accept.bind(this)}
                    handleCancel={this.toggle.bind(this, "confirm")} />

                <ModalConfirm
                    message={"Do you want to delete?"}
                    isOpen={this.state.delete}
                    handleOk={this.deleteIssue.bind(this)}
                    handleCancel={this.toggle.bind(this, "delete")} />
                <ModalAddTag
                    isOpen={this.state.addTag}
                    handleOk={this.Addtag.bind(this)}
                    handleCancel={this.toggle.bind(this, "addTag")}
                />
            </Card>
        )
    }
}

export default connect(store => ({
    app: store.app,
    user: store.user,
    store: store
}))(Right);