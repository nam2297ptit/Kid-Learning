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
// Quiz
import Quiz from "../pages/quiz/Quiz";

// Questions
// import Questions from "../pages/questions/Questions";
import Activity from "../pages/activity/Activity.js";
import Configuration from "../pages/configuration/Configuration";

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

const pageRoutes = {
    path: "/",
    name: "Landing Page",
    children: [
        {
            path: "/activity",
            name: "Hoạt động",
            component: Activity,
        },
        {
            path: "/quiz",
            name: "Danh sách bài kiểm tra",
            component: Quiz,
        },
        {
            path: "/configuration",
            name: "Cài đặt",
            component: Configuration,
        },
    ],
};

export const page = [pageRoutes];
// Dashboard specific routes
export const dashboard = [dashboardRoutes];

// Auth specific routes
export const auth = [authRoutes];
// All routes
export default [authRoutes, dashboardRoutes];
