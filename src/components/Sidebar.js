import React from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Box } from "react-feather";
import { Badge, Button } from "reactstrap";
// import PerfectScrollbar from "react-perfect-scrollbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faCircle,
    faTasks,
    faChartLine,
    faUsers,
    faFolder,
    faCog,
    faStar,
    faBook,
    faSignOutAlt,
    faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";

import routes from "../routes/index";
const utils = require("../utils/utils");

const SidebarItem = withRouter(({ name, badgeColor, badgeText, icon: Icon, location, to }) => {
    const getSidebarItemClass = path => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <li className={"sidebar-item " + getSidebarItemClass(to)}>
            <NavLink to={to} className='sidebar-link' activeClassName='active'>
                {Icon ? <FontAwesomeIcon icon={Icon} className='align-middle mr-3' /> : null}
                {name}
                {badgeColor && badgeText ? (
                    <Badge color={badgeColor} size={18} className='sidebar-badge'>
                        {badgeText}
                    </Badge>
                ) : null}
            </NavLink>
        </li>
    );
});

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toggle = index => {
        this.setState(state => ({
            [index]: !state[index],
        }));
    };

    componentDidMount() {
        /* Open collapse element that matches current url */
        const pathName = this.props.location.pathname;

        routes.forEach((route, index) => {
            const isActive = pathName.indexOf(route.path) === 0;
            const isOpen = route.open;
            const isHome = route.containsHome && pathName === "/" ? true : false;
            this.setState(() => ({
                [index]: isActive || isOpen || isHome,
            }));
        });
    }

    render() {
        const { sidebar, layout, user } = this.props;
        return (
            <nav
                className={
                    "sidebar" +
                    (!sidebar.isOpen ? " toggled" : "") +
                    (sidebar.isSticky ? " sidebar-sticky" : "")
                }>
                <div className='sidebar-content'>
                    <a className='sidebar-brand' href='/'>
                        <Box className='align-middle text-primary mr-2' size={30} />{" "}
                        <span className='align-middle'>E-Learn Manager</span>
                    </a>

                    <ul className='sidebar-nav'>
                        <React.Fragment>
                            <h4>
                                <SidebarItem name='Tests' icon={faTasks} to='/quiz' />
                            </h4>
                            <h4>
                                <SidebarItem
                                    name='Configurations'
                                    icon={faCog}
                                    to='/configuration'
                                />
                            </h4>
                            {/* <h4>
                                <SidebarItem name='History' icon={faChartLine} to='/history' />
                            </h4> */}
                        </React.Fragment>
                    </ul>

                    {/* {!layout.isBoxed && !sidebar.isSticky ? ( */}
                    <div
                        className='sidebar-bottom d-none d-lg-block m-auto bg-mute'
                        style={{ "background-color": " #b3d1ff" }}>
                        <media>
                            <Link
                                to={
                                    window.location.pathname === "/activity" ||
                                    window.location.pathname === "/configuration" ||
                                    window.location.pathname === "/history"
                                        ? "/quiz"
                                        : window.location.pathname === "/quiz"
                                        ? "subject"
                                        : null
                                }>
                                <FontAwesomeIcon
                                    icon={faArrowAltCircleLeft}
                                    color='green'
                                    size='2x'
                                    className='d-inline mr-3'
                                />
                            </Link>

                            <h4 className='font-weight-bold  m-auto text-center text-primary d-inline mb-4 '>
                                Tiếng anh lớp 6
                            </h4>
                        </media>
                    </div>
                    {/* ) : null} */}
                </div>
            </nav>
        );
    }
}

export default withRouter(
    connect(store => ({
        sidebar: store.sidebar,
        layout: store.layout,
        user: store.user,
        project: store.project,
    }))(Sidebar),
);
