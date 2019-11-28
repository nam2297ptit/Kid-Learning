import React from "react";
import { connect } from "react-redux";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import { Link } from "react-router-dom";
// import $ from "jquery";

import {
    Collapse,
    Navbar,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

import { PieChart, Settings, User } from "react-feather";
import { CustomImg } from "../components/CustomTag";

import logo from "../assets/img/logo/logo.png";
import "./Navbar.css";

const utils = require("../utils/utils");
const API = require("./api/api");

class NavbarComponent extends React.Component {
    hanleLogout() {
        sessionStorage.clear();
    }

    render() {
        const { dispatch } = this.props;
        return (
            <Navbar color='white' light expand>
                <span className='d-none d-sm-inline-block float-left'></span>
                {!this.props.isSidebar ? null : (
                    <span
                        className='sidebar-toggle d-flex mr-2'
                        onClick={() => {
                            dispatch(toggleSidebar());
                        }}>
                        <i className='hamburger align-self-center' />
                    </span>
                )}
                <Collapse navbar>
                    <Nav className='ml-auto' navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <span className='d-inline-block d-sm-none'>
                                <DropdownToggle nav caret>
                                    <Settings size={18} className='align-middle' />
                                </DropdownToggle>
                            </span>
                            <span className='d-none d-sm-inline-block'>
                                <DropdownToggle nav caret>
                                    <CustomImg
                                        src=''
                                        className='avatar img-fluid rounded-circle mr-1'
                                        alt='Avatar'
                                    />
                                    <h5 className='text-dark mr-1 d-inline font-weight-bold'>
                                        Admin
                                    </h5>
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
