//import async from "../components/Async";

import { Layout as LayoutIcon, Sliders as SlidersIcon, Users as UsersIcon } from "react-feather";

// Auth
import SignIn from "../pages/auth/SignIn";
// import SignUp from "../pages/auth/SignUp";
// import ResetPassword from "../pages/auth/ResetPassword";
// import Page404 from "../pages/auth/Page404";
// import Page500 from "../pages/auth/Page500";
// import SignUpSuccessfully from "../pages/auth/ActiveUser";
// import CreateNewPassword from "../pages/auth/CreateNewPassWord";

// Sucject
import Subject from "../pages/subject/Subject";

// Pages
// import Profile from "../pages/profile/Profile";
// import Pricing from "../pages/pages/Pricing";
// import Clients from "../pages/pages/Clients";
// import Work from "../pages/work/Work";
// import Wiki from "../pages/wiki/Wiki";
// import Storage from "../pages/storage/Storage";
// import Report from "../pages/report/Report";
// import Admin from "../pages/admin/Admin";
// import Timeline from "../pages/timeline/Timeline.js";
// import WorkDetail from "../pages/work/work-detail/WorkDetail";
// import WorkDeTailActivities from "../pages/work/work-detail/CardLeft/Activities";
// import WorkDeTailComment from "../pages/work/work-detail/CardLeft/Comment";
// import Task from "../pages/task/Task";
// import Epic from "../pages/epic/Epic";
// import Issue from "../pages/issue/Issue";

// import Root from "../pages/root/root";
// import Term from "../pages/term/Term";
// import Discover from "../pages/discover/Discover";

// Dashboards
// const Default = async(() => import("../pages/dashboards"));

const dashboardRoutes = {
    path: "/",
    name: "DashboardLayout",
    header: "Main",
    containsHome: true,
    open: true,
    children: [
        {
            path: "/subject",
            name: "Danh sách môn học",
            component: Subject,
        },
    ],
};

const authRoutes = {
    path: "/auth",
    name: "Auth",
    children: [
        {
            path: "/auth/sign-in",
            name: "Sign In",
            component: SignIn,
        },
        // {
        //     path: "/auth/sign-up",
        //     name: "Sign Up",
        //     component: SignUp,
        // },
        // {
        //     path: "/auth/reset-password",
        //     name: "Reset Password",
        //     component: ResetPassword,
        // },
        // {
        //     path: "/auth/404",
        //     name: "404 Page",
        //     component: Page404,
        // },
        // {
        //     path: "/auth/500",
        //     name: "500 Page",
        //     component: Page500,
        // },
        // {
        //     path: "/auth/sign-up-successfully",
        //     name: "Sign Up Successfully Page",
        //     component: SignUpSuccessfully,
        // },
        // {
        //     path: "/auth/create-new-pass",
        //     name: "Create New Password Page",
        //     component: CreateNewPassword,
        // },
    ],
};

const landingRoutes = {
    path: "/",
    name: "Landing Page",
    children: [],
};

export const landing = [landingRoutes];
// Dashboard specific routes
export const dashboard = [dashboardRoutes];

// Auth specific routes
export const auth = [authRoutes];
// All routes
export default [authRoutes, dashboardRoutes];
