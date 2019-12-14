import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { dashboard as dashboardRoutes, page as pageRoutes, auth as authRoutes } from "./index";

import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

const PrivateRoute = (Layout, routes, isSidebar) =>
    routes.map(({ children, path, component: Component }, index) =>
        children ? (
            // Route item with children
            children.map(({ path, component: Component }, index) => (
                <Route
                    key={index}
                    path={path}
                    exact
                    render={props => (
                        <Layout isSidebar={isSidebar}>
                            <Component {...props} />
                        </Layout>
                    )}
                />
            ))
        ) : (
            // Route item without children
            <Route
                key={index}
                path={path}
                exact
                render={props => (
                    <Layout isSidebar={isSidebar}>
                        <Component {...props} />
                    </Layout>
                )}
            />
        ),
    );

const PublicRoute = (Layout, routes) =>
    routes.map(({ children, path, component: Component }, index) =>
        children ? (
            // Route item with children
            children.map(({ path, component: Component }, index) => (
                <Route
                    key={index}
                    path={path}
                    exact
                    render={props => (
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    )}
                />
            ))
        ) : (
            // Route item without children
            <Route
                key={index}
                path={path}
                exact
                render={props => (
                    <Layout>
                        <Component {...props} />
                    </Layout>
                )}
            />
        ),
    );

function Routes() {
    return (
        <Router>
            {/* <ScrollToTop> */}
            <Switch>
                <Route exact path='/' render={() => <Redirect to='/subject' />} />
                {PublicRoute(AuthLayout, authRoutes)}
                {PublicRoute(DashboardLayout, dashboardRoutes, true)}
                {PrivateRoute(DashboardLayout, pageRoutes, true)}

                {/* {localStorage.getItem("token") !== null ? (
                    PrivateRoute(DashboardLayout, pageRoutes, true)
                ) : (
                    <Redirect to='/auth/sign-in' />
                )} */}
                {/* <Route
                    render={() => (
                        <AuthLayout>
                            <Page404 />
                        </AuthLayout>
                    )}
                /> */}
            </Switch>
        </Router>
    );
}
export default Routes;
