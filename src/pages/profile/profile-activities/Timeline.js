import React, { Component } from 'react';
import {
  Button, Card, CardBody, Media,
  Row, Col,
} from "reactstrap";
import Notification from "../../../components/Notification";
import "../Profile.css"
import LoadingSprinner from "../../../components/LoadingSprinner"
import {CustomImg} from "../../../components/CustomTag"
import { Link, ArrowRight} from "react-feather"
import moment from 'moment'
import { connect } from "react-redux";
import {isEmpty} from "../../../utils/ValidInput"
const api = require('../api/api')
const apiProject = require('../../project/api/api')

class Timeline extends Component {
  constructor(props) {
      super(props)
      this.state={
          data: [],
          maxLoad: 10,
          wikiChangeID: null,
      }
      this.convertDateTime = this.convertDateTime.bind(this)
  }
  loadMore(){
      this.setState({ maxLoad: this.state.maxLoad + 10 })
  }
  componentDidMount() {
      const {user,id} = this.props
      this.setState({loadApiGetTimeline: false})
      api.getTimeline(user.user.id,id, (err, result) => {
          if (err) {
            console.log('getTimeLine error')
            Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
          }
          else {
            this.setState({ data: result, loadApiGetTimeline: true})
          }
      })
  }
  wikiChangeMore(id) {
      this.setState({
          wikiChangeID: id
      })
  }
  wikiChangeLess() {
      this.setState({
          wikiChangeID: null
      })
  }
  handleSelectProject(id,type,idCustom){
    apiProject.getInfoProject(id, (err, result)=>{
        if(err){
            Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
        } else {
            const { id, i_am_owner, i_am_admin, i_am_member } = result;
            let project = {
                id: id,
                i_am_owner: i_am_owner,
                i_am_admin: i_am_admin,
                i_am_member: i_am_member
            }
            sessionStorage.setItem('project', JSON.stringify(project))
            if(type === 'timeline')     window.location.replace("/project/work")
            else if(type === 'work')    window.location.replace("/project/work?id="+idCustom)
            else if(type === 'task')    window.location.replace("/project/work/task?id="+idCustom)
            else if(type === 'wiki')    window.location.replace("/project/wiki")
            else if(type === 'issue')   window.location.replace("/project/issue?id="+idCustom)
            else if(type === 'epic')    window.location.replace("/project/epic")
            else if(type === 'members') window.location.replace("/project/clients")
        }
    })
  }
  //title of time occur event
  convertDateTime(date, getFullTime){
    let convertdate   = new Date(date)
    let date_year     = convertdate.getFullYear()
    let date_month    = convertdate.getMonth()+1;
    let date_date     = convertdate.getDate()
    if (date_month < 10) date_month = '0' + date_month;
    if (date_date < 10) date_date = '0' + date_date;
    let _date = `${date_date}-${date_month}-${date_year}`
    let _time = `${convertdate.toLocaleTimeString().substr(0,5)}`
    return getFullTime ? `${_time} ${_date}` : _date;
  }
  renderHeaderEvent(data) {
    const idUser      = this.props.user.user.id;
    const profileUser = <strong>
                          <a title={data.data.user.full_name} href={data.data.user.id !== idUser ? `?email=${data.data.user.email}` : window.location.pathname}>
                            {data.data.user.full_name}
                          </a>
                        </strong>
                        
    //link to project
    let linkWork_ofTask = '';
    if (data.type.substring(0, 5) === "tasks") {
        linkWork_ofTask = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'work', data.data.object.work.id)}>
                            {data.data.object.work.name}
                          </a>}

    let linkProject     = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'timeline',null)}>
                            {data.data.project.subject}
                          </a>
    let linkWork        = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'work',data.data.object.id)}>
                            {data.data.object.subject}
                          </a>
    let linkTask        = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'task',data.data.object.id)}>
                            {data.data.object.subject}
                          </a>
    let linkWiki        = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'wiki',null)}>
                            {data.data.object.subject}
                          </a>
    let linkIssue       = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'issue',data.data.object.id)}>
                            {data.data.object.subject}
                          </a>
    let linkEpic        = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'epic',null)}>
                            {data.data.object.subject}
                          </a>
    let linkMembers     = <a href='# ' className="text-primary" onClick={this.handleSelectProject.bind(this,data.data.project.id,'members',null)}>
                            {data.data.project.subject}
                          </a>

    switch (data.type) {
        //project event
        case "projects.create":
            return (
                <div>{profileUser} has created a new project {linkProject}</div>)
        case "projects.change.subject":
            return (
                <div>{profileUser} has updated the attribute "Subject" of the project {linkProject}</div>)
        case "projects.change.description":
            return (
                <div>{profileUser} has updated the attribute "Description" of the project {linkProject}</div>)
        case "projects.change.budget":
            return (
                <div>{profileUser} has updated the attribute "Budget" of the project {linkProject}</div>)
        case "projects.change.currency":
            return (
                <div>{profileUser} has updated the attribute "Currency" of the project {linkProject}</div>)
        case "projects.change.is_private":
            return (
                <div>{profileUser} has changed the type of the project {linkProject}</div>)
        case "projects.delete":
            return (
                <div>{profileUser} has deleted the project {data.data.project.subject}</div>)
        //membership event
        case "memberships.create":
            return (
                <div>{profileUser} has added a new member to the project {linkMembers}</div>)
        case "memberships.change.role":
            return (
                <div>{profileUser} has updated the attribute "Role" of a member in the project {linkMembers}</div>)
        case "memberships.change.is_admin":
            return (
                <div>{profileUser} has updated a member as a administrator in the project {linkMembers}</div>)
        case "memberships.delete":
            return (
                <div>{profileUser} has removed a member from the project {linkMembers}</div>)
        //work event
        case "works.create":
            return (
                <div>{profileUser} has created a new work {linkWork} in the project {linkProject}</div>)
        case "works.change.status":
            return (
                <div>{profileUser} has updated the attribute "Status" of the work {linkWork} in the project {linkProject}</div>)
        case "works.change.subject":
            return (
                <div>{profileUser} has updated the attribute "Subject" of the work {linkWork} in the project {linkProject}</div>)
        case "works.change.description":
            return (
                <div>{profileUser} has updated the attribute "Description" of the work {linkWork} in the project {linkProject}</div>)
        case "works.change.due_date":
            return (
                <div>{profileUser} has updated the attribute "Due date" of the work {linkWork} in the project {linkProject}</div>)
        case "works.change.assigned_users":
            console.log(data.data.diff.assigned_users[1],typeof data.data.diff.assigned_users[1])
            return (
                <div>{profileUser} has assigned member to the work {linkWork} in the project {linkProject}</div>)
        case "works.change.watchers":
            return (
                <div>{profileUser} has added watcher to the work {linkWork} in the project {linkProject}</div>)
        case "works.change.attachments":
            if (!isEmpty(data.data.diff.attachments.new)) {
                return (
                    <div>{profileUser} has uploaded a new file in the work {linkWork} in the project {linkProject}</div>)
            }
            else if (!isEmpty(data.data.diff.attachments.deleted)) {
                return (
                    <div>{profileUser} has deleted a file in the work {linkWork} in the project {linkProject}</div>)
            } else return null;
        case "works.delete":
            return (
                <div>{profileUser} has deleted the work <strong>{data.data.object.subject}</strong> in the project {linkProject}</div>)
        //task event
        case "tasks.create":
            return (
                <div>{profileUser} has created a new task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.status":
            return (
                <div>{profileUser} has updated the attribute "Status" of the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.subject":
            return (
                <div>{profileUser} has updated the attribute "Subject" of the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.description":
            return (
                <div>{profileUser} has updated the attribute "Description" of the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.due_date":
            return (
                <div>{profileUser} has updated the attribute "Due date" of the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.assigned_to":
            return (
                <div>{profileUser} has assigned a member to the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.watchers":
            return (
                <div>{profileUser} has added watcher to the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.is_closed":
            return (
                <div>{profileUser} has changed the type of the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        case "tasks.change.attachments":
            if (!isEmpty(data.data.diff.attachments.new)) {
                return (
                    <div>{profileUser} has uploaded a new file in the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
            }
            if (!isEmpty(data.data.diff.attachments.deleted)) {
                return (
                    <div>{profileUser} has deleted a file in the task {linkTask} in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
            } else return null;
        case "tasks.delete":
            return (
                <div>{profileUser} has deleted the task <strong>{data.data.object.subject}</strong> in the project {linkProject} which belongs to the work {linkWork_ofTask}</div>)
        //issue event
        case "issues.create":
            return (
                <div>{profileUser} has created a new issue {linkIssue} in {linkProject}</div>)
        case "issues.change.status":
            return (
                <div>{profileUser} has updated the attribute "Status" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.subject":
            return (
                <div>{profileUser} has updated the attribute "Subject" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.description":
            return (
                <div>{profileUser} has updated the attribute "Description" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.due_date":
            return (
                <div>{profileUser} has updated the attribute "Due date" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.type":
            return (
                <div>{profileUser} has updated the attribute "Type" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.severity":
            return (
                <div>{profileUser} has updated the attribute "Severity" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.priority":
            return (
                <div>{profileUser} has updated the attribute "Priority" of the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.assigned_to":
            return (
                <div>{profileUser} has assigned a member to the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.watchers":
            return (
                <div>{profileUser} has added watcher to the issue {linkIssue} in the project {linkProject}</div>)
        case "issues.change.attachments":
            if (!isEmpty(data.data.diff.attachments.new)) {
                return (
                    <div>{profileUser} has uploaded a new file in the issue {linkIssue} in the project {linkProject}</div>)
            }
            else if (!isEmpty(data.data.diff.attachments.deleted)) {
                return (
                    <div>{profileUser} has deleted a file in the issue {linkIssue} in the project {linkProject}</div>)
            } else return null;
        case "issues.delete":
            return (
                <div>{profileUser} has deleted the issue <strong>{data.data.issue.subject}</strong> in {linkProject}</div>)
        //wiki event
        case "wiki.create":
            return (
                <div>{profileUser} has created a new wiki {linkWiki} in the project {linkProject}</div>)
        case "wiki.change.content":
            return (
                <div>{profileUser} has changed content of the wiki {linkWiki} in the project {linkProject}</div>)
        case "wiki.change.attachments":
            if (!isEmpty(data.data.diff.attachments.new)) {
                return (
                    <div>{profileUser} has uploaded a new file in the wiki {linkWiki} in the project {linkProject}</div>)
            }
            else if (!isEmpty(data.data.diff.attachments.deleted)) {
                return (
                    <div>{profileUser} has deleted a file in the wiki {linkWiki} in the project {linkProject}</div>)
            } else return null;
        case "wiki.delete":
            return (
                <div>{profileUser} has deleted the wiki <strong>{data.data.object.subject}</strong> in the project {linkProject}</div>)
        //epic event
        case "epics.create":
            return (
                <div>{profileUser} has created a new epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.status":
            return (
                <div>{profileUser} has updated the attribute "Status" of the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.subject":
            return (
                <div>{profileUser} has updated the attribute "Subject" of the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.description":
            return (
                <div>{profileUser} has updated the attribute "Description" of the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.due_date":
            return (
                <div>{profileUser} has updated the attribute "Due date" of the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.assigned_to":
            return (
                <div>{profileUser} has assigned a member to the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.watchers":
            return (
                <div>{profileUser} has added watcher to the epic {linkEpic} in the project {linkProject}</div>)
        case "epics.change.attachments":
            if (!isEmpty(data.data.diff.attachments.new)) {
                return (
                    <div>{profileUser} has uploaded a new file in the epic {linkEpic} in the project {linkProject}</div>)
            }
            else if (!isEmpty(data.data.diff.attachments.deleted)) {
                return (
                    <div>{profileUser} has deleted a file in the epic {linkEpic} in the project {linkProject}</div>)
            } else return null;
        case "epics.delete":
            return (
                <div>{profileUser} has deleted the epic <strong>{data.data.object.subject}</strong> in the project {linkProject}</div>)
        default:
            return null;
    }
  }
  renderFooterEvent(data) {
    const idUser = this.props.user.user.id;
    switch (data.type) {
        //project event
        case "projects.create":
            return (
              data.data.diff.description !== null && 
              <DetailTimeline 
                  type="create" 
                  description={data.data.project.description}
              />)
        case "projects.change.subject":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.subject[0]} 
                  next={data.data.diff.subject[1]}
              />)
        case "projects.change.description":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.description[0]} 
                  next={data.data.diff.description[1]}
              />)
        case "projects.change.budget":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.budget[0]} 
                  next={data.data.diff.budget[1]}
              />)
        case "projects.change.currency":
            return (
                <DetailTimeline 
                    type="change_attr" 
                    previous={data.data.diff.currency[0]} 
                    next={data.data.diff.currency[1]}
                />)
        case "projects.change.is_private":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.is_private[0] ? "Public" : "Private"} 
                  next={data.data.diff.is_private[1] ? "Private" : "Public"}
              />)
        //membership event
        case "memberships.create":
            return (
              <DetailTimeline 
                  type="user" 
                  id={data.data.object.id} idUser={idUser} 
                  email={data.data.object.email} 
                  photo={data.data.object.photo} 
                  full_name={data.data.object.full_name}
                  next={data.data.diff.role[1]}
              />)
        case "memberships.change.role":
            return (
              <DetailTimeline 
                  type="user" 
                  id={data.data.object.id} idUser={idUser} 
                  email={data.data.object.email} 
                  photo={data.data.object.photo} 
                  full_name={data.data.object.full_name}
                  previous={data.data.diff.role[0]}
                  next={data.data.diff.role[1]}
              />)
        case "memberships.change.is_admin":
            return (
              <DetailTimeline 
                  type="user" 
                  id={data.data.object.id} idUser={idUser} 
                  email={data.data.object.email} 
                  photo={data.data.object.photo} 
                  full_name={data.data.object.full_name} 
              />)
        case "memberships.delete":
            return (
              <DetailTimeline 
                  type="user" 
                  id={data.data.object.id} idUser={idUser} 
                  email={data.data.object.email} 
                  photo={data.data.object.photo} 
                  full_name={data.data.object.full_name} 
              />)
        //work event
        case "works.create":
            return (
                data.data.diff.description !== null && 
              <DetailTimeline 
                  type="create" 
                  description={data.data.diff.description}
              />)
        case "works.change.status":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.status[0]} 
                  next={data.data.diff.status[1]}
              />)
        case "works.change.subject":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.subject[0]} 
                  next={data.data.diff.subject[1]}
              />)
        case "works.change.description":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.description[0]} 
                  next={data.data.diff.description[1]}
              />)
        case "works.change.due_date":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.due_date[0] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[0],false)} 
                  next={data.data.diff.due_date[1] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[1],false)}
              />)
        case "works.change.assigned_users":
            return (
              <DetailTimeline />)
        case "works.change.watchers":
            return (
              <DetailTimeline />)
        case "works.change.attachments":
            if(!isEmpty(data.data.diff.attachments.new)){
              return ( 
                <DetailTimeline 
                    type="new" 
                    content={data.data.diff.attachments.new.subject} 
                    href={data.data.diff.attachments.new.attached_file}
                />)
            }
            if(!isEmpty(data.data.diff.attachments.deleted)){
              return ( 
                <DetailTimeline 
                    type="delete" 
                    content={data.data.diff.attachments.deleted.subject}
                />)
            } else return null;
        //task event
        case "tasks.create":
            return (
                data.data.diff.description !== null && <DetailTimeline 
                  type="create" 
                  description={data.data.diff.description}
              />)
        case "tasks.change.status":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.status[0]} 
                  next={data.data.diff.status[1]}
              />)
        case "tasks.change.subject":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.subject[0]} 
                  next={data.data.diff.subject[1]}
              />)
        case "tasks.change.description":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.description[0]} 
                  next={data.data.diff.description[1]}
              />)
        case "tasks.change.due_date":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.due_date[0] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[0],false)} 
                  next={data.data.diff.due_date[1] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[1],false)}
              />)
        case "tasks.change.assigned_to":
            return (
              <DetailTimeline />)
        case "tasks.change.watchers":
            return (
              <DetailTimeline />)
        case "tasks.change.is_closed":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.is_closed[0]} 
                  next={data.data.diff.is_closed[1]}
              />)
        case "tasks.change.attachments":
            if(!isEmpty(data.data.diff.attachments.new)){
              return ( 
                <DetailTimeline 
                    type="new" 
                    content={data.data.diff.attachments.new.subject} 
                    href={data.data.diff.attachments.new.attached_file}
                />)
            }
            else if(!isEmpty(data.data.diff.attachments.deleted)){
              return ( 
                <DetailTimeline 
                    type="delete" 
                    content={data.data.diff.attachments.deleted.subject}
                />)
            } else return null;
        //issue event
        case "issues.create":
            return (
              data.data.diff.description !== null && 
              <DetailTimeline 
                  type="create" 
                  description={data.data.diff.description}
              />)
        case "issues.change.status":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.status[0]} 
                  next={data.data.diff.status[1]}
              />)
        case "issues.change.subject":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.subject[0]} 
                  next={data.data.diff.subject[1]}
              />)
        case "issues.change.description":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.description[0]} 
                  next={data.data.diff.description[1]}
              />)
        case "issues.change.due_date":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.due_date[0] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[0],false)} 
                  next={data.data.diff.due_date[1] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[1],false)}
              />)
        case "issues.change.type":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.type[0]} 
                  next={data.data.diff.type[1]}
              />)
        case "issues.change.severity":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.severity[0]} 
                  next={data.data.diff.severity[1]}
              />)
        case "issues.change.priority":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.priority[0]} 
                  next={data.data.diff.priority[1]}
              />)
        case "issues.change.assigned_to":
            return (
              <DetailTimeline />)
        case "issues.change.watchers":
            return (
              <DetailTimeline />)
        case "issues.change.attachments":
            if(!isEmpty(data.data.diff.attachments.new)){
              return ( 
                <DetailTimeline 
                    type="new" 
                    content={data.data.diff.attachments.new.subject} 
                    href={data.data.diff.attachments.new.attached_file}
                />)
            }
            if(!isEmpty(data.data.diff.attachments.deleted)){
              return ( 
                <DetailTimeline 
                    type="delete" 
                    content={data.data.diff.attachments.deleted.subject}
                />)
            } else return null;
        //wiki event
        case "wiki.change.attachments":
            if(!isEmpty(data.data.diff.attachments.new)){
              return (
                <DetailTimeline 
                    type="new" 
                    content={data.data.diff.attachments.new.subject} 
                    href={data.data.diff.attachments.new.attached_file}
                />)
            }
            else if(!isEmpty(data.data.diff.attachments.deleted)){
              return ( 
                <DetailTimeline 
                    type="delete" 
                    content={data.data.diff.attachments.deleted.subject}
                />)
            } else return null;
        //epic event
        case "epics.create":
            return (
              data.data.diff.description !== null && 
              <DetailTimeline 
                  type="create" 
                  description={data.data.diff.description}
              />)
        case "epics.change.status":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.status[0]} 
                  next={data.data.diff.status[1]}
              />)
        case "epics.change.subject":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.subject[0]} 
                  next={data.data.diff.subject[1]}
              />)
        case "epics.change.description":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.description[0]} 
                  next={data.data.diff.description[1]}
              />)
        case "epics.change.due_date":
            return (
              <DetailTimeline 
                  type="change_attr" 
                  previous={data.data.diff.due_date[0] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[0],false)} 
                  next={data.data.diff.due_date[1] === "null" ? 'Not set' : this.convertDateTime(data.data.diff.due_date[1],false)}
              />)
        case "epics.change.assigned_to":
            return (
              <DetailTimeline />)
        case "epics.change.watchers":
            return (
              <DetailTimeline />)
        case "epics.change.attachments":
            if(!isEmpty(data.data.diff.attachments.new)){
              return (
                <DetailTimeline 
                    type="new" 
                    content={data.data.diff.attachments.new.subject} 
                    href={data.data.diff.attachments.new.attached_file}
                />)
            }
            else if(!isEmpty(data.data.diff.attachments.deleted)){
              return (
                <DetailTimeline 
                    type="delete" 
                    content={data.data.diff.attachments.deleted.subject}
                />)
            } else return null;
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
          {this.state.data==='No Content' ? this.state.data : this.state.data.slice(0, this.state.maxLoad).map((data, index) => {
            return (
            <div key={index}>
              <Media>
                {/* avatar */}
                <Media left href={data.data.user.id !== idUser ? `?email=${data.data.user.email}` : window.location.pathname}>
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
                      {this.renderHeaderEvent(data)}
                    </Media>
                  </div>
                  {/* time */}
                  <div className="float-right" title={this.convertDateTime(data.created_date,true)}>
                    {moment(data.created_date).fromNow()}
                  </div>
                </Media>
              </Media>
              <div className="Profile__marginleft_58px_toRem">
                {this.renderFooterEvent(data)}
              </div>
              <hr />
            </div>
          )}
          )}
          {this.state.maxLoad < this.state.data.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
        </CardBody>
      </Card>}
      </div>
    )
  }
}
export default connect(store => ({
  user: store.user
}))(Timeline)

//content below the header of the events
class DetailTimeline extends Component {
  render() {
    const props = this.props;
    const domainFile = 'http://fback.tinasoft.com.vn:3001/static/media/'
    const extention_img = ['png','jpg','gif','tiff','bmp']
    return (
            props.type === 'create' ? //event create a project, work, ...   //description
            <div>
                <blockquote className="Profile__quote">
                    {props.description}
                </blockquote>
            </div>
          : props.type === 'new' ?    //event create a new attachment       //content, href
            <div>
                <blockquote className="Profile__quote">
                    {extention_img.includes(props.href.split('.')[props.href.split('.').length-1].toLowerCase()) ? 
                    //if the file as a image -> show preview image
                        <a title={`See ${props.content}`} target="_blank" rel="noopener noreferrer" href={domainFile+props.href}>
                        <img className="Profile__size-imgfile-timeline" src={domainFile+props.href}/>
                        </a>
                    :
                    //if not -> show file name
                        <a target="_blank" rel="noopener noreferrer" download href={domainFile+props.href}>
                        <Link size="2%"/>
                        {props.content}
                        </a>
                    }
                </blockquote>
            </div>
          : props.type === 'delete' ? //event delete a attachment           //content
            <div>
                <blockquote className="Profile__quote">
                    <del style={{background: '#ffe6e6'}}>
                    <Link size="2%"/>
                    {props.content}
                    </del>
                </blockquote>
            </div>
          : props.type === 'user'   ? //event relative to a user            //id, idUser, email, photo, full_name, role
            <div>
                <blockquote className="Profile__quote">
                    <Row>
                    <div className="float-left">
                        <Media left href={props.id!==props.idUser ? `?email=${props.email}` : window.location.pathname}>
                        <CustomImg
                            src={props.photo}
                            className="rounded-circle mr-2 img--user--square-3x"
                            title={props.full_name}
                            alt="Avatar"
                        />
                        </Media>
                    </div>
                    <div>
                        <Media heading>
                        <a title={props.full_name} href={props.id!==props.idUser ? `?email=${props.email}` : window.location.pathname}>{props.full_name}</a>
                        </Media>
                        <Media>
                            <del style={{background: '#ffe6e6'}}>
                                {props.previous}
                            </del>
                            {props.previous && <ArrowRight size="5%"/>}
                            <ins style={{background: '#e6ffe6'}}>
                                {props.next}
                            </ins>    
                        </Media>
                    </div>
                    </Row>
                </blockquote>
            </div>
          : props.type === 'change_attr' ?
            <div>
                <blockquote className="Profile__quote">
                    <div className="position-relative">
                        <div className="float-left" style={{background: '#ffe6e6'}}>
                            <del dangerouslySetInnerHTML={{ __html: props.previous}}/>
                        </div>
                        <ArrowRight className="float-left" size="2%"/>
                        <div className="float-left" style={{background: '#e6ffe6'}}>
                            <ins dangerouslySetInnerHTML={{ __html: props.next}}/>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </blockquote>
            </div>
          : null
    )
  }
}

//is_close, change details
//content event changed attribute

//delete file in folder
//change administrator rights

//return from db error: assign_users, assign_to, watcher
//can't remove due_date