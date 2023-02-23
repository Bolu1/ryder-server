interface LoggedInUserObject {
    _id?: string | undefined
    code?: string 
    createdAt?: string
    email?: string
    full_name?: string
    phone?: string
    role?: any
    status?: boolean
    updatedAt?: boolean
    __v?: number
    id?: string,
    avatar?: string,
    permissionsObject?: any
  }
  
  type AuthState = {
    userObject: LoggedInUserObject
  }
  
  type AuthAction = {
    type: string
    userObject: LoggedInUserObject
  }
  
  type DispatchType = (args: AuthAction) => AuthAction