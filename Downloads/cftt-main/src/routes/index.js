import React from 'react';
import PrivacyPolicy from 'pages/Legal/PrivacyPolicy';
import Login from 'pages/Authentication/Login';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import Register from 'pages/Authentication/Register';
import EnterPin from 'pages/Authentication/EnterPin';
import ResetPassword from 'pages/Authentication/ResetPassword';
import Home from 'pages/Home';
import Members from 'pages/Members';
import Requests from 'pages/Requests';
import Administrators from 'pages/Administrators';
import Branches from 'pages/Branches';
import Groups from 'pages/Groups';
import Settings from 'pages/Settings';
import SingleAnnouncement from 'pages/Announcement/ViewAnnouncement';
import CreateAnnouncement from 'pages/Announcement/CreateAnnouncement';
import Calendar from 'pages/Calendar';
import CreateCalendarEvent from 'pages/Calendar/CreateCalendarEvent';
import { Redirect } from 'react-router-dom';
import Publications from 'pages/Publications';
import Transactions from 'pages/Transactions';
import Terms from 'pages/Legal/Terms';
import Support from 'pages/Legal/Support';
import ViewCalenderEvent from 'pages/Calendar/ViewCalenderEvent';
import Appointments from 'pages/Appointments';
import permissionsObj from 'constants/permissionConstants';

export const authRoutes = [
	{path: '/', component: () => <Redirect to="/login" />},
	{ path: "/login", component: Login },
	{ path: "/forgotpassword", component: ForgotPassword },
	{ path: "/enterpin", component: EnterPin},
	{ path: "/resetpassword", component: ResetPassword},
	{ path: '/change-password/:token', component: <> Token</>},
	{ path: "/register", component: Register},

];

export const publicRoutes = [
	{ path:	"/privacy-policy", component: PrivacyPolicy},
	{ path: "/terms-and-conditions", component: Terms},
	{ path: "/support", component: Support},
];

export const privateRoutes = [
	{ path: "/home", component: Home },
	{ path: "/members", component: Members, permission: permissionsObj.VIEW_USERS },
	{ path: "/requests", component: Requests },
	{path: "/administrators", component: Administrators, permission: permissionsObj.VIEW_ADMIN},
	{path: "/branches", component: Branches, permission: permissionsObj.VIEW_BRANCH},
	{path: "/groups", component: Groups, permission: permissionsObj.VIEW_GROUP},
	{path: "/settings", component: Settings},
	{path:"/appointments", exact: true, component: Appointments, permission: permissionsObj.VIEW_APPOINTMENT},
	{path:"/announcements/create", exact: true, component: CreateAnnouncement},
	{path:"/announcements/:id", exact: true, component: SingleAnnouncement},
	{path:"/calendar/event/:id", exact: true, component: CreateCalendarEvent},
	{path:"/calendar", exact: true, component: Calendar},
	{path:"/calendar/create-event", exact: true, component: CreateCalendarEvent},
	{path:"/calendar/view-event/:id", exact: true, component: ViewCalenderEvent},
	{path:"/publications", exact: true, component: Publications},
	{path:"/transactions", exact: true, component: Transactions},
];