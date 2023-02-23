import permissionsObj from 'constants/permissionConstants';
import React from 'react';
import { 
    Dashboard, 
    Users, 
    CurrencyDollar,
    Table,
    Calendar,
    Settings,
    User,
    GitBranch,
    ArrowsMinimize,
    UserCheck
 } from 'tabler-icons-react';
export const sideBarRoutes = [
    {
        title: '',
        children:[
            {
                text: 'Dashboard',
                icon: <Dashboard />,
                path:'/home',
                match:/^\/home/,
            },
            {
                text: 'Members',
                icon: <Users />,
                path:'/members',
                match:/^\/members/,
                permission: permissionsObj.VIEW_USERS
            },
            // {
            //     text: 'Requests',
            //     icon: <BellPlus />,
            //     path:'/requests',
            //     match:/^\/requests/,
            // },
            {
                text: 'Transactions',
                icon: <CurrencyDollar />,
                path:'/transactions',
                match:/^\/transactions/,
                // permission: permissionsObj.VIEW_
            },
            {
                text: 'Administrators',
                icon: <User />,
                path:'/administrators',
                match:/^\/administrators/,
                permission: permissionsObj.VIEW_ADMIN
            },
        ],
    },
    {
        title: 'UPDATE SECTIONS',
        children:[
            {
                text: 'Appointments',
                icon: < UserCheck />,
                path:'/appointments',
                match:/^\/appointments/,
                permission: permissionsObj.VIEW_APPOINTMENT
            },
            {
                text: 'Publications',
                icon: <Table />,
                path:'/publications',
                match:/^\/publications/,
            },
            {
                text: 'Calendar',
                icon: <Calendar />,
                path:'/calendar',
                match:/^\/calendar/
            }
        ],
    },
    {
        title: 'CONFIG',
        children:[
            {
                text: 'Branches',
                icon: <GitBranch />,
                path:'/branches',
                match:/^\/branches/,
                permission: permissionsObj.VIEW_BRANCH
            },
            {
                text: 'Group',
                icon: <ArrowsMinimize />,
                path:'/groups',
                match:/^\/groups/,
                permission: permissionsObj.VIEW_GROUP
            }
        ],
    },
    {
        title: 'OTHERS',
        children:[
            {
                text: 'Settings',
                icon: <Settings />,
                path:'/settings',
                match:/^\/settings/,
            },
            // {
            //     text: 'Logout',
            //     icon: <Logout />,
            //     path:'/logout',
            // }
        ],
    },
];