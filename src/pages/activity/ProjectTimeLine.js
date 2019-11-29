import React, { Component } from 'react';
import {
    Button, Card, CardBody, Media,
} from "reactstrap";
import Notification from "../../components/Notification";
//import "./../../Profile.css"
import LoadingSprinner from "../../components/LoadingSprinner"
import { CustomImg } from "../../components/CustomTag"
import { Link } from "react-feather"
import moment from 'moment'
import { connect } from "react-redux";
import { isEmpty } from "../../utils/ValidInput"
const api = require('./api/api')

class ProjectTimeLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            maxLoad: 10,
            wikiChangeID: null,
        }
    }
    loadMore() {
        this.setState({ maxLoad: this.state.maxLoad + 10 })
    }
    componentDidMount() {
        this.setState({ loadApiGetTimeline: false });
        api.getActivities(1, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                this.setState({ data: result, loadApiGetTimeline: true })
            }
        })
    }
    wikiChangeMore(id) {
        this.setState({
            wikiChangeID: id
        });
    }
    wikiChangeLess() {
        this.setState({
            wikiChangeID: null
        });
    }
    handleSelectProject(type, idCustom) {
        api.getInfoProject((err, result) => {
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
                if (type === 'timeline') window.location.replace("/project/work")
                else if (type === 'work') window.location.replace("/project/work?id=" + idCustom)
                else if (type === 'task') window.location.replace("/project/work/task?id=" + idCustom)
                else if (type === 'wiki') window.location.replace("/project/wiki")
                else if (type === 'issue') window.location.replace("/project/issue")
                else if (type === 'epic') window.location.replace("/project/epic")
                else if (type === 'members') window.location.replace("/project/clients")
            }
        });
    }
    renderDataEventType(data) {
        console.log('object_id:', data.data.object.id);
        const idUser = this.props.user.user.id;
        const profileUser = <strong><a title={data.data.user.full_name} href={data.data.user.id !== idUser ?
            `?email=${data.data.user.email}` :
            window.location.pathname}>{data.data.user.full_name}</a></strong>
        //link
        let linkWork_ofTask = '';
        if (data.type.substring(0, 5) === "tasks") {
            linkWork_ofTask = (<a
                href='# '
                className="text-primary"
                onClick={this.handleSelectProject.bind(this, 'work', data.data.object.work.id)}>
                {data.data.object.work.subject}
            </a>)
        }
        let linkProject = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'timeline', null)}>
            {data.data.project.subject}
        </a>)
        let linkWork = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'work', data.data.object.id)}>
            {data.data.object.subject}
        </a>)
        let linkTask = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'task', data.data.object.id)}>
            {data.data.object.subject}
        </a>)
        let linkWiki = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'wiki', null)}>
            {data.data.object.subject}
        </a>)
        let linkIssue = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'issue', data.data.object.id)}>
            {data.data.object.subject}
        </a>)
        let linkEpic = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'epic', null)}>
            {data.data.object.subject}
        </a>)
        let linkMembers = (<a
            href='# '
            className="text-primary"
            onClick={this.handleSelectProject.bind(this, 'members', null)}>
            {data.data.project.subject}
        </a>)
        switch (data.type) {
            case "projects.create":
                return (
                    <div >{profileUser} has created a new project {linkProject}</div>
                );
            case "projects.change.subject":
                return (
                    <div >{profileUser} has updated the attribute "Subject" of the project {linkProject}</div>
                );
            case "projects.change.description":
                return (
                    <div >{profileUser} has updated the attribute "Description" of the project {linkProject}</div>
                );
            case "projects.change.is_private":
                return (
                    <div >{profileUser} has changed the type of the project {linkProject}</div>
                );
            case "projects.delete":
                return (
                    <div >{profileUser} has deleted the project {data.data.project.subject}</div>
                );
            case "memberships.create":
                return (
                    <div >{profileUser} has added a new member to the project {linkMembers}</div>
                );
            case "memberships.change.role":
                return (
                    <div >{profileUser} has updated the attribute "Role" of a member in the project {linkMembers}</div>
                );
            case "memberships.change.is_admin":
                return (
                    <div >{profileUser} has added a member as a admin of the project {linkMembers}</div>
                );
            case "memberships.delete":
                return (
                    <div >{profileUser} has removed a member from the project {linkMembers}</div>
                );
            case "works.create":
                return (
                    <div >{profileUser} has created a new work {linkWork} in the project {linkProject}</div>
                );
            case "works.change.status":
                return (
                    <div >{profileUser} has updated the attribute "Status" of the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.subject":
                return (
                    <div >{profileUser} has updated the attribute "Subject" of the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.description":
                return (
                    <div >{profileUser} has updated the attribute "Description" of the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.due_date":
                return (
                    <div >{profileUser} has updated the attribute "Due date" of the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.assigned_users":
                return (
                    <div >{profileUser} has assigned a member to the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.watchers":
                return (
                    <div >{profileUser} has added a watcher to the work {linkWork}
                        in the project {linkProject}</div>
                );
            case "works.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <div >{profileUser} has uploaded a new file in the work {linkWork}
                            in the project {linkProject}</div>
                    );
                } else return null;

            case "works.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <div >{profileUser} has deleted a file in the work {linkWork}
                            in the project {linkProject}</div>
                    );
                } else return null;
            case "works.delete":
                return (
                    <div >{profileUser} has deleted the work <strong>{data.data.object.subject}</strong>
                        in the project {linkProject}</div>
                );
            case "tasks.create":
                return (
                    <div >{profileUser} has created a new task {linkTask} in the project {linkProject}
                        which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.status":
                return (
                    <div >{profileUser} has updated the attribute "Status" of the task {linkTask}
                        in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.subject":
                return (
                    <div >{profileUser} has updated the attribute "Subject" of the task {linkTask}
                        in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.description":
                return (
                    <div >{profileUser} has updated the attribute "Description" of the task {linkTask}
                        in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.due_date":
                return (
                    <div >{profileUser} has updated the attribute "Due date" of the task {linkTask}
                        in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.watchers":
                return (
                    <div >{profileUser} has added a watcher to the task {linkTask} in the project {linkProject}
                        which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.is_closed":
                return (
                    <div >{profileUser} has changed the type of the task {linkTask} in the project {linkProject}
                        which belongs to the work {linkWork_ofTask}</div>
                );
            case "tasks.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <div >{profileUser} has uploaded a new file in the task {linkTask} in the project {linkProject}
                            which belongs to the work {linkWork_ofTask}</div>
                    );
                } else return null;
            case "tasks.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <div >{profileUser} has deleted a file in the task {linkTask} in the project {linkProject}
                            which belongs to the work {linkWork_ofTask}</div>
                    );
                } else return null;
            case "tasks.delete":
                return (
                    <div >{profileUser} has deleted the task <strong>{data.data.object.subject}</strong>
                        in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>
                );
            case "issues.create":
                return (
                    <div >{profileUser} has created a new issue {linkIssue} in {linkProject}</div>
                );
            case "issues.change.status":
                return (
                    <div >{profileUser} has updated the attribute "Status" of the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.subject":
                return (
                    <div >{profileUser} has updated the attribute "Subject" of the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.description":
                return (
                    <div >{profileUser} has updated the attribute "Description" of the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.due_date":
                return (
                    <div >{profileUser} has updated the attribute "Due date" of the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.assigned_to":
                return (
                    <div >{profileUser} has assigned a member to the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.watchers":
                return (
                    <div >{profileUser} has added a watcher to the issue {linkIssue}
                        in the project {linkProject}</div>
                );
            case "issues.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <div >{profileUser} has uploaded a new file in the issue {linkIssue}
                            in the project {linkProject}</div>
                    );
                } else return null;
            case "issues.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <div >{profileUser} has deleted a file in the issue {linkIssue}
                            in the project {linkProject}</div>
                    );
                } else return null;
            case "issues.delete":
                return (
                    <div >{profileUser} has deleted the issue <strong>{data.data.issue.subject}</strong>
                        in {linkProject}</div>
                );
            case "wiki.create":
                return (
                    <div >{profileUser} has created a new wiki {linkWiki} in the project {linkProject}</div>
                );
            case "wiki.change.content":
                return (
                    <div >{profileUser} has changed content of the wiki {linkWiki} in the project {linkProject}</div>
                );
            case "wiki.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <div >{profileUser} has uploaded a new file in the wiki {linkWiki} in the project {linkProject}</div>
                    );
                } else return null;
            case "wiki.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <div >{profileUser} has deleted a file in the wiki {linkWiki} in the project {linkProject}</div>
                    );
                } else return null;
            case "wiki.delete":
                return (
                    <div >{profileUser} has deleted the wiki <strong>{data.data.object.subject}</strong>
                        in the project {linkProject}</div>
                );
            case "epics.create":
                return (
                    <div >{profileUser} has created a new epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.status":
                return (
                    <div >{profileUser} has updated the attribute "Status" of the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.subject":
                return (
                    <div >{profileUser} has updated the attribute "Subject" of the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.description":
                return (
                    <div >{profileUser} has updated the attribute "Description" of the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.due_date":
                return (
                    <div >{profileUser} has updated the attribute "Due date" of the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.assigned_to":
                return (
                    <div >{profileUser} has assigned a member to the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.watchers":
                return (
                    <div >{profileUser} has added a watcher to the epic {linkEpic} in the project {linkProject}</div>
                );
            case "epics.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <div >{profileUser} has uploaded a new file in the epic {linkEpic} in the project {linkProject}</div>
                    );
                } else return null;
            case "epics.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <div >{profileUser} has deleted a file in the epic {linkEpic} in the project {linkProject}</div>
                    );
                } else return null;
            case "epics.delete":
                return (
                    <div >{profileUser} has deleted the epic <strong>{data.data.object.subject}</strong>
                        in the project {linkProject}</div>
                );

            default:
                return null;
        }
    }
    renderDetailTimeline(data) {
        const idUser = this.props.user.user.id;
        switch (data.type) {
            case "projects.create":
                return (
                    <DetailTimeline
                        type="create"
                        description={data.data.project.description} />
                );
            case "memberships.create":
                return (
                    <DetailTimeline
                        type="user"
                        id={data.data.object.id}
                        idUser={idUser}
                        email={data.data.object.email}
                        photo={data.data.object.photo}
                        full_name={data.data.object.subject}
                        role={data.data.object.role} />
                );
            case "memberships.change.role":
                return (
                    <DetailTimeline
                        type="user"
                        id={data.data.object.id}
                        idUser={idUser}
                        email={data.data.object.email}
                        photo={data.data.object.photo}
                        full_name={data.data.object.subject}
                        role={data.data.object.role} />
                );
            case "memberships.change.is_admin":
                return (
                    <DetailTimeline
                        type="user"
                        id={data.data.object.id}
                        idUser={idUser}
                        email={data.data.object.email}
                        photo={data.data.object.photo}
                        full_name={data.data.object.subject}
                        role={data.data.object.role} />
                );
            case "memberships.delete":
                return (
                    <DetailTimeline
                        type="user"
                        id={data.data.object.id}
                        idUser={idUser}
                        email={data.data.object.email}
                        photo={data.data.object.photo}
                        full_name={data.data.object.subject}
                        role={data.data.object.role} />
                );
            case "works.create":
                return (
                    <DetailTimeline
                        type="create"
                        description={data.data.diff.description} />
                );
            case "works.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <DetailTimeline
                            type="new"
                            content={data.data.diff.attachments.new.subject}
                            href={data.data.diff.attachments.new.attached_file} />
                    );
                }
                else return null;
            case "works.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <DetailTimeline
                            type="delete"
                            content={data.data.diff.attachments.deleted.subject} />
                    );
                }
                else return null;
            case "tasks.create":
                return (
                    <DetailTimeline
                        type="create"
                        description={data.data.diff.description} />
                );
            case "tasks.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <DetailTimeline
                            type="new"
                            content={data.data.diff.attachments.new.subject}
                            href={data.data.diff.attachments.new.attached_file} />
                    );
                }
                else return null;
            case "tasks.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <DetailTimeline
                            type="delete"
                            content={data.data.diff.attachments.deleted.subject} />
                    );
                }
                else return null;
            case "issues.create":
                return (
                    <DetailTimeline
                        type="create"
                        description={data.data.diff.description} />
                );
            case "issues.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <DetailTimeline
                            type="new"
                            content={data.data.diff.attachments.new.subject}
                            href={data.data.diff.attachments.new.attached_file} />
                    );
                }
                else return null;
            case "issues.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <DetailTimeline
                            type="delete"
                            content={data.data.diff.attachments.deleted.subject} />
                    );
                }
                else return null;
            case "wiki.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <DetailTimeline
                            type="new"
                            content={data.data.diff.attachments.new.subject}
                            href={data.data.diff.attachments.new.attached_file} />
                    );
                }
                else return null;
            case "wiki.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <DetailTimeline
                            type="delete"
                            content={data.data.diff.attachments.deleted.subject} />
                    );
                }
                else return null;
            case "epics.create":
                return (
                    <DetailTimeline
                        type="create"
                        description={data.data.diff.description} />
                );
            case "epics.change.attachments":
                if (!isEmpty(data.data.diff.attachments.new)) {
                    return (
                        <DetailTimeline
                            type="new"
                            content={data.data.diff.attachments.new.subject}
                            href={data.data.diff.attachments.new.attached_file} />
                    );
                }
                else return null;
            case "epics.change.attachments":
                if (!isEmpty(data.data.diff.attachments.deleted)) {
                    return (
                        <DetailTimeline
                            type="delete"
                            content={data.data.diff.attachments.deleted.subject} />
                    );
                }
                else return null;
            default:
                return null;
        }
    }
    render() {
        const idUser = this.props.user.user.id
        return (
            <div>
                {!this.state.loadApiGetTimeline ? <LoadingSprinner /> :
                    <Card>
                        <CardBody className="tiles mb-4" aria-live="polite">
                            {this.state.data === 'No Content' ? this.state.data :
                                this.state.data.slice(0, this.state.maxLoad).map((data, index) => {
                                    //title of time occur event
                                    let convertdate = new Date(data.created_date)
                                    let date_year = convertdate.getFullYear();
                                    let date_month = convertdate.getMonth() + 1;
                                    let date_date = convertdate.getDate();
                                    if (date_month < 10) date_month = '0' + date_month;
                                    if (date_date < 10) date_date = '0' + date_date;
                                    let created_date = `${convertdate.toLocaleTimeString().substr(0, 5)} ${date_date}/${date_month}/${date_year}`;
                                    return (
                                        <div key={index}>
                                            <Media>
                                                {/* avatar */}
                                                <Media left href={data.data.user.id !== idUser ? `?email=${data.data.user.email}` :
                                                    window.location.pathname}>
                                                    <CustomImg
                                                        src={data.data.user.photo}
                                                        className="rounded-circle mr-2 img--user--square-3x"
                                                        title={data.data.user.full_name}
                                                        alt="Avatar"
                                                    />
                                                </Media>
                                                {/* body */}
                                                <Media body>
                                                    {/* content */}
                                                    <div className="float-left Profile__width_88">
                                                        <Media>
                                                            {this.renderDataEventType(data)}
                                                        </Media>
                                                    </div>
                                                    {/* time */}
                                                    <div className="float-right" title={created_date}>
                                                        {moment(new Date(data.created_date)).fromNow()}
                                                    </div>
                                                </Media>
                                            </Media>
                                            <div className="Profile__marginleft_58px_toRem">
                                                {this.renderDetailTimeline(data)}
                                            </div>
                                            <hr />
                                        </div>
                                    )
                                }
                                )}
                            {
                                this.state.maxLoad < this.state.data.length &&
                                <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>
                            }
                        </CardBody>
                    </Card>}
            </div>
        );
    }
}
export default connect(store => ({
    user: store.user
}))(ProjectTimeLine);

//content below the header of the events
class DetailTimeline extends Component {
    render() {
        const props = this.props;
        return (
            props.type === 'create' ? //event create a project, work, ...   //content, href
                <div>
                    <blockquote className="Profile__quote">{props.description}</blockquote>
                </div>
                : props.type === 'new' ?    //event create a new attachment       //content, href
                    <div>
                        <blockquote className="Profile__quote">
                            {props.href.split('.')[props.href.split('.').length - 1].toLowerCase() === ('png' || 'jpg' || 'gif' || 'jpeg' || 'tiff' || 'bmp') ?
                                //if the file as a image -> show preview image
                                <a title={`See ${props.content}`} target="_blank" rel="noopener noreferrer" href={props.href}>
                                    <img className="Profile__size-imgfile-timeline" src={props.href} />
                                </a>
                                :
                                //if not -> show file name
                                <a target="_blank" rel="noopener noreferrer" download href={props.href}>
                                    <Link size="2%" />
                                    {props.content}
                                </a>
                            }
                        </blockquote>
                    </div>
                    : props.type === 'delete' ? //event delete a attachment           //content
                        <div>
                            <blockquote className="Profile__quote">
                                <del style={{ background: '#ffe6e6' }}>
                                    <Link size="2%" />
                                    {props.content}
                                </del>
                            </blockquote>
                        </div>
                        : props.type === 'user' ? //event relative to a user            //id, idUser, email, photo, full_name, role
                            <div>
                                <blockquote className="Profile__quote">
                                    <div className="float-left">
                                        <Media left href={props.id !== props.idUser ? `?email=${props.email}` : window.location.pathname}>
                                            <CustomImg
                                                src={props.photo}
                                                className="rounded-circle mr-2 img--user--square-3x"
                                                title={props.full_name}
                                                alt="Avatar"
                                            />
                                        </Media>
                                    </div>
                                    <Media heading>
                                        <a title={props.full_name} href={props.id !== props.idUser ? `?email=${props.email}` : window.location.pathname}>{props.full_name}</a>
                                    </Media>
                                    <Media>{props.role}</Media>
                                </blockquote>
                            </div>
                            : null
        )
    }
}

//event role, is_admin, is_private, is_close, change details
//content event changed attribute