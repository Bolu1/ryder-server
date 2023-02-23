import React, {useReducer} from 'react';
import { Eye, EyeOff } from 'tabler-icons-react';
import './authforminput.scss';
interface propInterface {
    icon?: any,
    placeholder?: string,
    value?: string | number,
    onChange?: any,
    type?: string,
    name?: string,
    showError?: string | boolean,
    errorMessage?: string,
}
const AuthFormInput = (props: propInterface): JSX.Element => {

    const initialState = {
        formData: {
            pin_1: '',
            pin_2: '',
            pin_3: '',
            pin_4: '',
            new_password: '',
        },
        showPassword: false,
        errors:{},
        pinError: false,
        isLoading: false,
        alertMessage:{},

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showPassword, pinError} = state;
    const {icon, placeholder, showError, errorMessage, type, ...rest} = props;
    return(
        <div className="p-0 m-0 auth-form-group">
            <div className="right-inner-addon input-container mb-2 ">
                {type === 'password'? (
                    <>
                        {showPassword? (
                            <span className="pointer" onClick={()=> setState({...state, showPassword: false})}>
                                <Eye
                                    size={60}
                                    strokeWidth={2}
                                    color={'#a3a3a3'}
                                />
                            </span>
                        ):(
                            <span className="pointer" onClick={()=> setState({...state, showPassword: true})}>
                                <EyeOff
                                    size={60}
                                    strokeWidth={2}
                                    color={'#a3a3a3'}
                                />
                            </span>
                        )}
                    </>
                ):(
                    <img alt="icon" src={icon} />
                )}
                
                <input 
                    type={type? type : 'text'}
                    className={`form-control ${showError? 'border border-danger text-danger' : ''}`} 
                    placeholder={placeholder}
                    {...rest}
                    />
                
            </div>
            {showError && (
                <div className="small w-100 text-left text-danger">
                    {errorMessage}
                </div>
            )}
            
        </div>
    )
};

export default AuthFormInput;