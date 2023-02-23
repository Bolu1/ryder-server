import Cookies from 'js-cookie';
import axios from 'axios';
import SetTokens, { history } from 'helpers';
const {
    removeTokens,
    clearLocalStorage
} = SetTokens;

const instance:any = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: false,
});

instance.interceptors.request.use(
    (config : any) => {
        const accessToken = Cookies.get('access-token');
        if(typeof accessToken !== 'undefined') {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            config.headers['Content-Type'] = 'application/json';
        }
        // const tenantUUID = JSON.parse(localStorage.getItem('selectedWorkspace'));
        // if(tenantUUID){
        //     config.headers['x-tenant-identifier'] = tenantUUID.uuid;
        // }
        
        return config;
    },
    (error :any)  => {
        return Promise.reject(error);
    } 
);

/**
 * 
 * @param {*} response API
 * @returns {object} response
 */
const successHandler = (response:any) => {
    return response;
};

/**
 * 
 * @param {*} error API
 * @returns {object} response
 */
const errorHandler = (error:any) => {
    const status = error.response.status;
    console.log(status);
    if (status === 401) {
    
        
        // removeTokens();
        // clearLocalStorage();
        // createBrowserHistory().push('/');
     
        history.push('/login');
        // window.location.reload();
        // store.dispatch(
        //     authActions.setLogoutSuccess()
        // );
        // store.dispatch(
        //     alertActions.error(
        //         'Your session has expired! Kindly Login again'
        //     )
        
        // return {};
    }
    return Promise.reject(error);
};

instance.interceptors.response.use(
    (response:any) => successHandler(response),
    (error: any)  => errorHandler(error)
);

export default instance;
