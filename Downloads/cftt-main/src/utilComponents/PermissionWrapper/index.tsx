import React from 'react';
import { useSelector, useDispatch } from "react-redux";
/**
 * HOC Component to render pages where Auth is not required
 * @param {*} param0
 * @returns {*} Route component
 */
const PermissionWrapper = (props:any) => {

    const reduxState = useSelector( (state:any) => state);
    const{userObject} = reduxState?.reducer;
    const { permission }= props;
    if (userObject) {
        if (permission) {
            let formatedPermission = permission.toUpperCase();
            formatedPermission = formatedPermission.replace(/ /g,"_");
            const {permissionsObject} = userObject;
            if(!permissionsObject[formatedPermission]){
                return <></>;
            } else {
                return <>{props.children} </>;
             }
            
        }else{
            return <>{props.children} </>;
        }
    }

    return null;
};

export default PermissionWrapper;
