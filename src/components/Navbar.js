import React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import { Link } from "react-router-dom";
// import $ from "jquery";

import {
    Row,
    Col,
    Collapse,
    Navbar,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ListGroup,
    ListGroupItem,
    UncontrolledTooltip,
} from "reactstrap";

import { Bell, Home, PieChart, Settings, User, Layout } from "react-feather";
import { CustomImg } from "../components/CustomTag";

import usFlag from "../assets/img/flags/us.png";
import vnFlag from "../assets/img/flags/vn.png";

import empty_avatar from "../assets/img/avatars/empty_avatar.png";
import "./Navbar.css";
import Notification from "./Notification";

const event = [
    "",
    "assigned you to",
    "has modified",
    "add you as watcher in",
    "add you as member",
    "has commented in",
    "mentioned you in a comment on",
];
const utils = require("../utils/utils");
const API = require("./api/api");

class NavbarDropdown extends React.Component {
    handleViewAllNotifications() {
        // api.setAsReadAllNotification((err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         Notification("success");
        //     }
        // });
    }

    render() {
        const { children, count, showBadge, header } = this.props;
        return (
            <UncontrolledDropdown nav inNavbar className='mr-2'>
                <DropdownToggle nav className='nav-icon dropdown-toggle'>
                    <div className='position-relative'>
                        <Bell id='navbar-notificatipn' className='align-middle' color='black' />
                        <UncontrolledTooltip placement='bottom' target='navbar-notificatipn'>
                            Notifications
                        </UncontrolledTooltip>
                        {showBadge ? <span className='indicator'>{count}</span> : null}
                    </div>
                </DropdownToggle>
                <DropdownMenu className='dropdown-menu-lg py-0 navbar__dropdown-menu'>
                    <div className='text-left p-3 font-weight-bold border-bottom position-relative'>
                        <Row>
                            <Col xl='6'>
                                {count} {header}
                            </Col>
                            {count === "0" ? (
                                <Col xl='6' className='text-right hover-pointer:hover'>
                                    <Link
                                        to='#'
                                        xl='6'
                                        className='text-success text-decoration-none'
                                        onClick={this.handleViewAllNotifications.bind(this)}>
                                        Dismiss all
                                    </Link>
                                </Col>
                            ) : null}
                        </Row>
                    </div>
                    <ListGroup>{children}</ListGroup>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }
}

class NavbarDropdownItem extends React.Component {
    constructor(props) {
        super(props);
        const { id_project, id_notification, id_work, id_task, id_issue } = this.props;
        this.state = {
            data: {
                id_project: id_project,
                id_work: id_work,
                id_task: id_task,
                id_issue: id_issue,
            },
            id_notification: id_notification,
        };
    }

    handleSelectProject() {
        API.getInfoProject(this.state.data.id_project, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member,
                };
                sessionStorage.setItem("project", JSON.stringify(project));
                window.location.replace("/project/work");
            }
        });
        // api.setAsReadNotification(this.state.id_notification, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ notification: result });
        //     }
        // });
    }

    handleSelectWork() {
        API.getInfoProject(this.state.data.id_project, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member,
                };
                sessionStorage.setItem("project", JSON.stringify(project));
                window.location.replace("/project/work?id=" + this.state.data.id_work);
            }
        });
        // api.setAsReadNotification(this.state.id_notification, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ notification: result });
        //     }
        // });
    }

    handleSelectTask() {
        API.getInfoProject(this.state.data.id_project, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member,
                };
                sessionStorage.setItem("project", JSON.stringify(project));
                window.location.replace("project/work/task?id=" + this.state.data.id_task);
            }
        });
        // api.setAsReadNotification(this.state.id_notification, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ notification: result });
        //     }
        // });
    }

    handleSelectIssue() {
        API.getInfoProject(this.state.data.id_project, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                const { id, i_am_owner, i_am_admin, i_am_member } = result;
                let project = {
                    id: id,
                    i_am_owner: i_am_owner,
                    i_am_admin: i_am_admin,
                    i_am_member: i_am_member,
                };
                sessionStorage.setItem("project", JSON.stringify(project));
                window.location.replace("project/issue?id=" + this.state.data.id_issue);
            }
        });
        // api.setAsReadNotification(this.state.id_notification, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ notification: result });
        //     }
        // });
    }

    handldeClickNotification() {
        // api.setAsReadNotification(this.state.id_notification, (err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         this.setState({ notification: result });
        //     }
        // });
    }

    render() {
        const {
            photo,
            user,
            event_type,
            subject,
            project,
            time,
            href,
            content_type,
            read,
        } = this.props;
        return (
            <ListGroupItem className={!read ? "navbar__background-read" : null}>
                <Row noGutters className='align-items-center'>
                    <Col xs={2}>
                        <Link to={href}>
                            <CustomImg
                                src={photo}
                                alt='avatar'
                                className='rounded-circle img--user--square-3x'
                            />
                        </Link>
                    </Col>
                    <Col xs={10} className='pl-2'>
                        <div className='font-weight-bold font-size-1x'>
                            <Link to='#' onClick={this.handleSelectProject.bind(this)}>
                                {project}
                            </Link>
                        </div>
                        <Link to={href} onClick={this.handldeClickNotification.bind(this)}>
                            <span className='font-weight-bold'>{user + " "}</span>
                        </Link>
                        <span className='font-italic'>{event_type + " "}</span>
                        <div className='text-muted font-size-1x'>{time.split("T")[0]}</div>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }
}

class NavbarComponent extends React.Component {
    // changeLanguage(lang) {
    //     this.setState({
    //         lang: lang,
    //     });
    //     let flag = lang === "en" ? usFlag : vnFlag;
    //     $("#language_selected").attr("src", flag);
    // }

    replacePage(page) {
        const { history } = this.props;
        history.push(page);
    }

    hanleLogout() {
        sessionStorage.clear();
    }

    render() {
        const { dispatch, user } = this.props;
        // const userInfo = user.user;
        // const avatar = userInfo.photo;
        // const name = userInfo.full_name;
        // const userId = userInfo.id;
        return (
            <Navbar color='white' light expand>
                {!this.props.isSidebar ? null : (
                    <span
                        className='sidebar-toggle d-flex mr-2'
                        onClick={() => {
                            dispatch(toggleSidebar());
                            console.log("123123");
                        }}>
                        <i className='hamburger align-self-center' />
                    </span>
                )}

                <Collapse navbar>
                    <Nav className='ml-auto' navbar>
                        <UncontrolledDropdown nav inNavbar className='mr-2'>
                            <DropdownToggle nav>
                                <Link to='/dashboard'>
                                    <Home id='navbar-dashboard' size={18} />
                                </Link>
                                <UncontrolledTooltip placement='bottom' target='navbar-dashboard'>
                                    Dashboard
                                </UncontrolledTooltip>
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar className='mr-2'>
                            <DropdownToggle nav>
                                <Link to='/project'>
                                    <Layout id='navbar-project' size={18} className='text-mute' />
                                </Link>
                                <UncontrolledTooltip placement='bottom' target='navbar-project'>
                                    Projects
                                </UncontrolledTooltip>
                            </DropdownToggle>
                        </UncontrolledDropdown>

                        <NavbarDropdown
                            header='New Notifications'
                            count={
                                this.props.notifications.filter(
                                    notifications => !notifications.read,
                                ).length
                            }
                            showBadge={true}>
                            {this.props.notifications
                                // .filter(notifications => !notifications.read)
                                .map(({ event_type, data, created_date, read, id }, key) => {
                                    return (
                                        <NavbarDropdownItem
                                            key={utils.randomString()}
                                            id_project={data.project.id}
                                            id_work={
                                                data.obj !== null &&
                                                data.obj.content_type === "projects_works"
                                                    ? data.obj.id
                                                    : null
                                            }
                                            id_task={
                                                data.obj !== null &&
                                                data.obj.content_type === "projects_tasks"
                                                    ? data.obj.id
                                                    : null
                                            }
                                            id_issue={
                                                data.obj !== null &&
                                                data.obj.content_type === "projects_issues"
                                                    ? data.obj.id
                                                    : null
                                            }
                                            id_notification={id}
                                            event_type={event[event_type]}
                                            user={data.user.full_name}
                                            photo={data.user.photo}
                                            subject={data.obj === null ? "" : data.obj.subject} // Mot so notification khong co subject
                                            project={data.project.name}
                                            time={created_date}
                                            read={read}
                                            // href={
                                            //     data.user.id === userId
                                            //         ? "/profile"
                                            //         : "/profile?email=" + data.user.email
                                            // }
                                            // content_type={
                                            //     data.obj === null ? null : data.obj.content_type
                                            // }
                                        />
                                    );
                                })}
                        </NavbarDropdown>

                        {/* <UncontrolledDropdown nav inNavbar className='mr-2'>
                            <DropdownToggle nav caret className='nav-flag'>
                                <CustomImg src={usFlag} alt='English' id='language_selected' />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={this.changeLanguage.bind(this, "en")}>
                                    <CustomImg
                                        src={usFlag}
                                        alt='English'
                                        width='20'
                                        className='align-middle mr-1'
                                    />
                                    <span className='align-middle'>English</span>
                                </DropdownItem>
                                <DropdownItem onClick={this.changeLanguage.bind(this, "vn")}>
                                    <CustomImg
                                        src={vnFlag}
                                        alt='Vietnam'
                                        width='20'
                                        className='align-middle mr-1'
                                    />
                                    <span className='align-middle'>Vietnam</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}

                        <UncontrolledDropdown nav inNavbar>
                            <span className='d-inline-block d-sm-none'>
                                <DropdownToggle nav caret>
                                    <Settings size={18} className='align-middle' />
                                </DropdownToggle>
                            </span>
                            <span className='d-none d-sm-inline-block'>
                                <DropdownToggle nav caret>
                                    {/* <CustomImg
                                        src={avatar !== null ? avatar : empty_avatar}
                                        className='avatar img-fluid rounded-circle mr-1'
                                        alt='Avatar'
                                    /> */}
                                    <h5 className='text-dark mr-1 d-inline'>Admin</h5>
                                </DropdownToggle>
                            </span>
                            <DropdownMenu right>
                                <Link to='/profile' className='text-dark'>
                                    <DropdownItem>
                                        <User size={18} className='align-middle mr-2' />
                                        Profile
                                    </DropdownItem>
                                </Link>
                                <Link to=''>
                                    <DropdownItem>
                                        <PieChart size={18} className='align-middle mr-2' />
                                        Analytics
                                    </DropdownItem>
                                </Link>
                                <DropdownItem divider />
                                <Link to=''>
                                    <DropdownItem>Settings & Privacy</DropdownItem>
                                </Link>
                                <Link to=''>
                                    <DropdownItem>Help</DropdownItem>
                                </Link>
                                <Link to='/auth/sign-in' className='text-dark'>
                                    <DropdownItem onClick={this.hanleLogout.bind(this)}>
                                        Sign out
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default connect(store => ({
    app: store.app,
    user: store.user,
}))(NavbarComponent);
