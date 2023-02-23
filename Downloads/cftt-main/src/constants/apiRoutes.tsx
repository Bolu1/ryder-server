export const apiRoutes = {
    LOGIN: '/auth/login',
    INITIATE_FORGOT_PASSWORD: '/auth/forgot/password',
    RESEND_PASSWORD_CODE: '/auth/resend/code',
    CONFIRM_PASSWORD: '/auth/confirm/password',
    CREATE_ADMIN: '/reg/create',
    GET_ALL_ADMINS:'/admin/all',
    GET_ALL_MEMBERS:'/admin/users',
    // Groups
    CREATE_GROUP:'/group/create',
    GET_ALL_GROUPS: '/group/all',
    GET_SINGLE_GROUP: '/group/get',
    // Branches
    CREATE_BRANCH: '/branch/create',
    GET_ALL_BRANCHES: '/branch/all',
    GET_SINGLE_BRANCH: '/branch/get',
    // APOSTLE DESK
    CREATE_APOSTLE_DESK_EVENT: '/admin/message/create',
    GET_ALL_APOSTLE_EVENT:'/admin/message/all',
    GET_SINGLE_APOSTLE_DESK_EVENT:'/admin/message',
    CREATE_MESSAGE_NOTE: '/admin/content/create',
    EDIT_MESSAGE_NOTE:'/admin/edit/content',
    GET_ALL_MESSAGE_NOTES:'/admin/content',
    // MESSAGE
    CREATE_MESSAGE:'/admin/message/create',
    UPDATE_MESSAGE:'/admin/edit/message',

    // Calendar events
    CREATE_CALENDAR_EVENT:'/admin/event/create',
    GET_ALL_CALENDAR_EVENT:'/admin/event/all',
    GET_SINGLE_EVENT:'/admin/event',
    EDIT_CALENDAR_EVENT:'/admin/edit/event',

};