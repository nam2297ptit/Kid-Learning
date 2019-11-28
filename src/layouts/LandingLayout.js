import React, {Component} from 'react'
import {ToastContainer} from 'react-toastify'

import HeaderOne from '../components/layouts/headers/HeaderOne'
import FooterOne from '../components/layouts/footers/FooterOne'
import {Helmet} from "react-helmet";

class Layout extends Component {

    closeOverlay() {
        let asideMenuOverlay = document.getElementById('header-aside-menu');
        let bodyWrapper = document.getElementById('body-wrapper');
        let asideCart = document.getElementById('sidebar-cart-active');
        let mobileMenu = document.getElementById('mobile-menu-overlay');

        asideCart.classList.remove('inside');
        asideMenuOverlay.classList.remove('inside');
        bodyWrapper.classList.remove('overlay-active');
        mobileMenu.classList.remove('active');
    }

    render() {
        return (
            <div>
                <div className="wrapper wrapper-2 wrapper-3" id="body-wrapper">
                    <div className="body-overlay-3"></div>
                    <div className="body-overlay-2"></div>
                    <div className="body-overlay" id="body-overlay" onClick={this.closeOverlay}></div>
                    <Helmet>
                        <title>VietLuck</title>
                        <meta name="description" content="Vietluck"/>
                    </Helmet>
                    <HeaderOne logo="/img/logo/logo.svg"/>
                    {this.props.children}
                    <FooterOne logo="/img/logo/logo.svg" borderTop="true"/>
                </div>
                <ToastContainer/>
            </div>
        )
    }
}

export default Layout
