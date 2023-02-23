import * as actionTypes from "./actionTypes"

const initialState: AuthState = {
    userObject:{}
};

const reducer = (
    state: AuthState = initialState,
    action: AuthAction
  ): AuthState => {
   
    switch (action.type) {
      case actionTypes.LOGIN_SUCCESSFUL:
        const obj:any ={};

        for (let i =0; i < action?.userObject?.role?.permissions.length; i++){
            const element =action?.userObject?.role?.permissions[i];
            let elName = element.description.toUpperCase();
            elName = elName.replace(/ /g,"_");
            obj[elName] = element.description;
        };
        const loginData: LoggedInUserObject = {
            code: action?.userObject?.code,
            createdAt: action?.userObject?.createdAt,
            email: action?.userObject?.email,
            full_name: action?.userObject?.full_name,
            phone: action?.userObject?.phone,
            role: action?.userObject?.role,
            status: action?.userObject?.status,
            updatedAt: action?.userObject?.updatedAt,
            id: action?.userObject?._id,
            avatar: action?.userObject?.avatar,
            permissionsObject: obj
        }
        return {
          ...state,
          userObject: loginData,
        }
      case actionTypes.LOGOUT_SUCCESSFUL:
        
        return {
          ...state,
          userObject: {},
        }
    }
    return state
  }
  
  export default reducer