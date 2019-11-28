import React from "react";
import {
    Nav,
    Row, Col, Container,
    Input,
    Button,
    UncontrolledTooltip,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChartLine, faEye, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { CustomImg } from "../../components/CustomTag"
import './Discover.css'
import utils from "../../../src/utils/utils";
import Notification from "../../components/Notification";
import Navbar from "../../components/Navbar";
import { LoadingSprinner } from "../../components/CustomTag";
import { connect } from "react-redux";

const api = require("./api/api");

class ItemMostDiscover extends React.Component {
    constructor(props) {
        super(props);
        const { id, name, is_private, logo } = this.props;
        this.state = {
            data: {
                id: id,
                name: name,
                is_private: is_private,
                logo: logo,
            },
            select_icon: false,
            watchers: 0
        }
    }

    componentDidMount() {
        let state = utils.copyState(this.state)
        api.getWatchers(this.state.data.id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                state.watchers = result.length;
                result.map((value) => {
                    if (this.props.UserId === value.id) {
                        state.select_icon = true;
                    }
                    return state.select_icon;
                })
                this.setState(state);
            }
        })
    }

    handlePostWatch(id) {
        let state = utils.copyState(this.state);
        state.select_icon = !state.select_icon;
        if (state.select_icon === true) {
            this.postWatch(id);
        }
        else this.postUnwatch(id);
        this.setState(state);
    }

    postWatch(id) {
        api.postWatch(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                let that = this;
                api.getWatchers(id, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({
                            watchers: result.length
                        });
                    }
                })
            }
        })
    }

    postUnwatch(id) {
        api.postUnwatch(id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                let that = this;
                api.getWatchers(id, (err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({
                            watchers: result.length
                        });
                    }
                })
            }
        })
    }

    handleSelectProject() {
        api.getInfoProject(this.state.data.id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                localStorage.setItem('project', JSON.stringify(result));
                window.location.replace("/project/work");
            }
        });
    }

    render() {
        return (
            <div className="border-bottom d-flex p-2">
                <NavLink className="pt-2" to="#" onClick={this.handleSelectProject.bind(this)}>
                    <CustomImg src={this.props.image} className="img--user--square-3x" />
                </NavLink>
                <div className="discover__project-content pl-3">
                    <div className="d-flex align-content-center justify-content-between">
                        <div className="d-flex flex-row mr-2">
                            <NavLink to="#" onClick={this.handleSelectProject.bind(this)} className="mr-3">
                                <h5 className="d-inline-block font-size-3x font-weight-bold">{this.props.name}</h5>
                            </NavLink>
                            <div className="mr-2">
                                <span id={"member" + this.props.id}>
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>{this.props.member}</span>
                                </span>
                                <UncontrolledTooltip placement="bottom" target={"member" + this.props.id}>
                                    {this.props.member === 1 ? this.props.member + " member" : this.props.member + " members"}
                                </UncontrolledTooltip>
                            </div>
                            <div className="mr-2">
                                <span id={"watchers" + this.props.id}>
                                    <FontAwesomeIcon icon={faEye} />
                                    <span>{this.state.watchers}</span>
                                </span>
                                <UncontrolledTooltip placement="bottom" target={"watchers" + this.props.id}>
                                    {this.props.member === 1 ? this.props.member + " member" : this.props.member + " members"}
                                </UncontrolledTooltip>
                            </div>
                        </div>
                        <div className="discover__project-content-icon">
                            <span id={"is_watchers" + this.props.id}>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className={"hover-pointer" + (this.state.select_icon ? " active" : " inactive")}
                                    size="2x"
                                    onClick={this.handlePostWatch.bind(this, this.props.id)}
                                />
                            </span>
                            <UncontrolledTooltip placement="bottom" target={"is_watchers" + this.props.id}>
                                watching
                            </UncontrolledTooltip>
                        </div>
                    </div>
                    <p className="m-0 text-muted">{"Created by: " + this.props.created_by}</p>
                    <p className="m-0">{"Description: " + this.props.description}</p>
                </div>
            </div>
        );
    }
}

class Discover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            infoUser: [],
            isLoaderAPI: false,
            status_load: true,
            max_most_active: 5,
            most_value_filter: "Last week",
            notification: [],
            dataOrigin: [],
            fieldSearch: "name"
        }
        this.count = 0;
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(event) {
        var value = event.target.value
        var name = this.state.fieldSearch
        let listProjectTemp = []
        if (value.length > 0) {
            this.state.dataOrigin.map((item) => {
                if ((name === 'name' ? item.name : null).toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    listProjectTemp.push(item)
                }
            })
            this.setState({ data: listProjectTemp });
        }
        else
            this.setState({ data: this.state.dataOrigin.filter(project => !project.is_private) })
    }

    change_data_most(status_most_filter) {
        const that = this;
        switch (status_most_filter) {
            case "Last week":
                api.getInfoProjectAll((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({ data: result.filter(project => !project.is_private), isLoaderAPI: true });
                    }
                });
                break;
            case "Last month":
                api.getInfoProjectAll((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({ data: result.filter(project => !project.is_private), isLoaderAPI: true });
                    }
                });
                break;
            case "Last year":
                api.getInfoProjectAll((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({ data: result.filter(project => !project.is_private), isLoaderAPI: true });
                    }
                });
                break;
            case "All time":
                api.getInfoProjectAll((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({ data: result.filter(project => !project.is_private), isLoaderAPI: true });
                    }
                });
                break;
            default:
                api.getInfoProjectAll((err, result) => {
                    if (err) {
                        Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
                    } else {
                        that.setState({ data: result.filter(project => !project.is_private), isLoaderAPI: true });
                    }
                });
                break;
        }
    }

    changeStateMostFilter(e) {
        var value = e.currentTarget.textContent;
        this.setState({
            most_value_filter: value,
            max_most_active: 5,
            isLoaderAPI: false,
        });
        this.change_data_most(value)
    }

    projectLoadMore() {
        const publicProject = this.state.dataOrigin.filter(project => !project.is_private)
        return (
            (this.state.max_most_active < publicProject.length && this.state.max_most_active < this.state.data.length) ?
                <Button
                    block color="info"
                    className="load-more"
                    onClick={() => this.setState({ max_most_active: this.state.max_most_active + 5 })}>
                    View More
                </Button>
                : null
        )
    }

    componentDidMount() {
        const that = this;
        api.getInfoProjectAll((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                that.setState({
                    data: result.filter(project => !project.is_private),
                    dataOrigin: result,
                    isLoaderAPI: true,
                });
            }
        })
    }

    render() {
        const { user } = this.props;
        let UserId = user.user.id;
        const publicProject = this.state.dataOrigin.filter(project => !project.is_private)
        const count = publicProject.length
        console.log('data:', this.state.data);
        console.log('UserId:', UserId);
        return (
            <div
                className="overflow-y-20x scrollbar-style-1 scrollbar-width-3x"
                style={{ maxHeight: "100vh" }}
            >
                {localStorage.getItem('userInfo') === JSON.parse("null") ?
                    <Nav className="bg-info">
                        <div className="ml-auto d-flex">
                            <NavLink
                                to="/auth/sign-in"
                                className="px-4 py-2 font-size-2x text-white text-decoration-none discover__link">
                                Login
                            </NavLink>
                            <NavLink
                                to="/auth/sign-up"
                                className="px-4 py-2 font-size-2x text-white text-decoration-none discover__link">
                                Sign up
                            </NavLink>
                        </div>
                    </Nav>
                    :
                    <Navbar notification={this.state.notification} />
                }

                <div className="discover-header full-width">
                    <div className="jumbotron rounded-0">
                        <h1 className="text-center">DISCOVER PROJECTS</h1>
                        <p className="text-center">{count} public projects to discover</p>
                        <Col>
                            <Input
                                className="main-search mx-auto width-percent-30"
                                id="inputSearch"
                                placeholder="Search Project"
                                onKeyUp={this.handleSearch.bind(this)}
                            />
                        </Col>
                    </div>
                </div>

                {this.state.isLoaderAPI ?
                    <Container fluid className="width-percent-60">
                        <Row>
                            <Col xl="6">
                                <h3 className="p-3">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <strong className="pl-2">PROJECTS MOST ACTIVE</strong>
                                </h3>
                            </Col>
                            <Col xl="6">
                                <div className="d-flex justify-content-between align-items-center float-right">
                                    <ul className="discover__filter-list p-1 d-flex flex-row list-unstyled">
                                        <li>
                                            <NavLink
                                                to="#"
                                                className={this.state.most_value_filter === "Last week" ? "active" : ""}
                                                onClick={this.changeStateMostFilter.bind(this)}>
                                                Last week
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="#"
                                                className={this.state.most_value_filter === "Last month" ? "active" : ""}
                                                onClick={this.changeStateMostFilter.bind(this)}>
                                                Last month
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="#"
                                                className={this.state.most_value_filter === "Last year" ? "active" : ""}
                                                onClick={this.changeStateMostFilter.bind(this)}>
                                                Last year
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="#"
                                                className={this.state.most_value_filter === "All time" ? "active" : ""}
                                                onClick={this.changeStateMostFilter.bind(this)}>
                                                All time
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        {this.state.data !== null ?
                            this.state.data.slice(0, this.state.max_most_active).map((data, key) => {
                                if (!data.is_private) {
                                    return (
                                        <ItemMostDiscover
                                            key={utils.randomString()}
                                            id={data.id}
                                            image={data.logo}
                                            name={data.name}
                                            created_by={data.owner.full_name}
                                            member={data.members.length}
                                            description={data.description}
                                            toolTipId={"project" + data.id}
                                            UserId={UserId}
                                        />
                                    )
                                }
                            })
                            : null
                        }
                        {this.projectLoadMore()}
                    </Container>
                    : <LoadingSprinner />
                }
            </div>
        );
    }
}
export default connect(
    store => ({
        user: store.user
    })
)(Discover);