import React, {useReducer} from 'react';
import WelcomeHeader from 'components/Auth/WelcomeHeader/index';
import AuthButton from 'components/Auth/AuthButton';
import AuthFormInput from 'components/Auth/AuthFormInputs';
import mailIcon from 'assets/images/mail.svg';
import { Link } from 'react-router-dom';
import { extractErrorMessage, isObjectEmpty, processAlertError } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { history, validateData } from 'helpers';
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { addUser } from "store/actionCreators";
import { Dispatch } from "redux";
import { useMutation } from '@apollo/client';
import { LOGIN } from 'GraphQl/Mutations';


const Login = ():JSX.Element => {
    const initialState = {
        formData: {
            email: '',
            password: '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors} = state;
    const [attemptLogin, { data, loading, error }] = useMutation(LOGIN);
    const dispatch: Dispatch<any> = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) :void  => {
        const {name, value} = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            errors:{
                [name]: '',
            }
        });
    };

    const validateFormData = async () => {
        const rules = {
            'email': 'required|email|validemail',
            'password' : 'required',
            
        };

        const messages = {
            'email.email': 'Enter valid email address',
            'email.required': 'Enter email address',
            'email.validemail': 'Enter valid email address',
            'password.required': 'Password required',
        };
        const validate = await validateData(formData, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate,
            });
            return false;
        }


    };
    
    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
          const validate = await validateFormData();
          if(validate){
           
            const loginData = await attemptLogin({variables:{creds:{email: formData?.email, password: formData?.password }}});
            const responseData = loginData?.data?.login;
            dispatch(addUser(responseData?.admin));
            Cookies.set('access-token', responseData?.token);
            if(responseData?.admin?.full_name){
                history.push('/home');
            }else{
                history.push('/settings');
            }
           
          };
          
          setState({
            isLoading: false,
          });
        } catch (error) {
           
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
        
    };
  
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };
   
    return(
        <>
            <WelcomeHeader 
                secondaryText="Sign into your account"
            />
            {alertMessage?.text && (
                <>
                    <AlertComponent
                        text={alertMessage.text}
                        type={alertMessage.type}
                        onClose={handleAlertClose}
                    />
                </>
            )}
           
            <div className="mb-3">
                <AuthFormInput
                    icon={mailIcon}
                    placeholder={'Email Address'}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    showError={errors.email}
                    errorMessage={errors.email}
                />
            </div>
            <div className="mb-3">
                <AuthFormInput
                    icon={mailIcon}
                    placeholder={'Password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    showError={errors.password}
                    errorMessage={errors.password}
                />
            </div>
            <div className="mb-4 w-100 d-flex justify-content-end ">
                <Link to="/forgotpassword" className="text-right">  
                    Forgot Password
                </Link>
            </div>
            <div className="mb-4">
                <AuthButton 
                    className="facebook-sign-in-button"
                    text="SIGN IN"
                    disabled={isLoading}
                    loading={isLoading}
                    actionEvent={(e)=> submit(e)}
                />
            </div>
        </>
    )

};
export default Login;