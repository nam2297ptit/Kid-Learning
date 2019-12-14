import React from "react";

import Wrapper from "../components/Wrapper";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Footer from "../components/Footer";

function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

class DashboardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            notifications: [],
        };
        this.handleLoading = this.handleLoading.bind(this);
    }

    handleLoading(action) {
        this.setState({
            isLoading: action,
        });
    }

    componentDidMount() {
        // api.getNotification((err, result) => {
        //     if (err) {
        //         Notification(
        //             "error",
        //             "Error",
        //             err.data === undefined ? err : err.status + " " + err.data._error_message,
        //         );
        //     } else {
        //         that.setState({
        //             notifications: result,
        //         });
        //     }
        // });
    }

    render() {
        let children_props = Object.assign(
            { handleLoading: this.handleLoading },
            this.props.children.props,
        );
        let children = _objectWithoutProperties(this.props.children, "props");
        children = Object.assign(children, { props: children_props });
        return (
            <React.Fragment>
                <Wrapper>
                    {this.props.isSidebar ? <Sidebar /> : null}

                    <Main>
                        <Navbar
                            notifications={this.state.notifications}
                            isSidebar={this.props.isSidebar}
                        />
                        <Content>{children}</Content>
                        <Footer />
                    </Main>
                </Wrapper>
            </React.Fragment>
        );
    }
}

export default DashboardLayout;
