import { createBrowserRouter } from "react-router-dom";
import { Landing } from "../pages/landing";
import { AuthLayout } from "../layouts/authLayout";
import { CommonLayout } from "../layouts/commonLayout";
import { Login } from "../auth/login";
import UserRegistration from "../auth/register";
import { ForgotPassword } from "../auth/forgotPassword";
import { DashboardLayout } from "../layouts/dashboardLayout";
import { ClubsPage } from "../pages/club_league/clubs/page";
import { CourtsPage } from "../pages/club_league/courts/page";

import { CL_Schedules } from "../pages/club_league/schedules";
import { Chat } from "../pages/club_league/chat";
import CreateGroupForm from "../pages/club_league/clubs/register/page.tsx";
import CourtRegistrationPage from "../pages/club_league/courts/register/page.tsx";

export const browserRoutes = createBrowserRouter([
    {

        element: <CommonLayout />,
        children: [
            {
                path: '/',
                element: <Landing />
            }
        ]
    },
    {
        element: <DashboardLayout />,
        children: [
            {
                path: '/ace/landing',
                element: <Landing />
            },
            {
                path: '/ap/club-league/clubs',
                element: <ClubsPage />,
            },
            {
                path: '/ap/club-league/clubs/register',
                element:  <CreateGroupForm type="Create" />
            },
            {
                path: '/ap/club-league/courts',
                element: <CourtsPage />,
            },
            {
                path: '/ap/club-league/courts/register',
                element: <CourtRegistrationPage  />
            },
            {
                path: '/ap/club-league/schedule',
                element: <CL_Schedules />
            },
            {
                path: '/ap/club-league/chat',
                element: <Chat />
            }
        ]
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <UserRegistration />
            },
            {
                path: '/forgotPassword',
                element: <ForgotPassword />
            }
        ]
    }

])