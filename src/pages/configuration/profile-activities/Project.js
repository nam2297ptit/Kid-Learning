import React, { Component } from 'react';
import {
  Button, Card, CardBody, Media,
} from "reactstrap";
import { Link } from "react-router-dom";
import Notification from "../../../components/Notification";
import "../Profile.css"
import LoadingSprinner from "../../../components/LoadingSprinner"
import {CustomImg} from "../../../components/CustomTag"
import { connect } from "react-redux";
const api = require('../api/api')
const apiProject = require('../../project/api/api')

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoad: 10,
            listProject: [],
            listContact: []
        }
    }
    loadMore(){
        this.setState({ maxLoad: this.state.maxLoad + 10 })
    }
    componentDidMount() {
        this.setState({loadApiGetProject: false, loadApiGetContact: false });
        api.getProject(this.props.id,(err,result) => {
            if (err) {
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
            console.log(result)
              this.setState({listProject:result, loadApiGetProject: true});
            }
        })
        api.getContacts(this.props.id,(err,result) => {
            if (err) {
              Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            }
            else {
                console.log(result)
              this.setState({listContact:result, loadApiGetContact: true});
            }
        })
    }
    handleSelectProject(id) {
        apiProject.getInfoProject(id, (err, result) => {
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
                window.location.replace("/project/work");
            }
        });
    }
    render() {
        const idUser = this.props.user.user.id
        return (
            <div>
                {(!this.state.loadApiGetProject || !this.state.loadApiGetContact) ? <LoadingSprinner /> :
                    <Card>
                        <CardBody className="tiles mb-4" aria-live="polite">
                            {this.state.listProject.slice(0, this.state.maxLoad).map((data, index) => (
                                <div key={index}>
                                    <Media>
                                        <div className="w-100">
                                            <div className="float-left">
                                                <Media left href='#' onClick={this.handleSelectProject.bind(this,data.id)}>
                                                    <CustomImg
                                                        src={data.logo}
                                                        className="rounded-circle mr-2 img--user--square-3x"
                                                        title={`${data.name}`}
                                                        alt="Avatar"
                                                    />
                                                </Media>
                                                <Media body className="float-right">
                                                    <Media>
                                                        <strong><Link title={data.name} to="#" onClick={this.handleSelectProject.bind(this,data.id)}>
                                                            {data.name}
                                                        </Link></strong>
                                                    </Media>
                                                    {data.description}
                                                </Media>
                                            </div>
                                            <div className="float-right w-25">
                                                {this.state.listContact.map((user, index) => (
                                                    data.members.indexOf(user.id) === -1 ? null :
                                                        <div key={index} className="float-right">
                                                            <Link to={user.id !== idUser ? `?email=${user.email}` : window.location.pathname}>
                                                                <CustomImg
                                                                    src={user.photo}
                                                                    className="rounded-circle mr-1 mt-1 img--user--square-2x"
                                                                    title={user.full_name}
                                                                    alt="Avatar"
                                                                />
                                                            </Link>
                                                        </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Media>
                                    <hr />
                                </div>
                            ))}
                            {this.state.maxLoad < this.state.listProject.length && <Button block color="primary" className="load-more" onClick={this.loadMore.bind(this)}>Load More</Button>}
                        </CardBody>
                    </Card>
                }
            </div>
        );
    }
}
export default connect(store => ({
    user: store.user
}))(Project);