import React, {useReducer} from 'react';
import WelcomeHeader from 'components/Auth/WelcomeHeader/index';
import AuthButton from 'components/Auth/AuthButton';
import AuthFormInput from 'components/Auth/AuthFormInputs';
import mailIcon from 'assets/images/mail.svg';
import { Link } from 'react-router-dom';
import { extractErrorMessage, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { history } from 'helpers';
import { useMutation } from '@apollo/client';
import { INITIATE_FORGOT_PASSWORD } from 'GraphQl/Mutations';

const ForgotPassword = ():JSX.Element => {
    const initialState = {
        formData: {
            email: '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage } = state;
    const [attemptInitiateForgotPassword, { data, loading, error }] = useMutation(INITIATE_FORGOT_PASSWORD);

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

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
          
          const response = await attemptInitiateForgotPassword({variables:{email: formData?.email}});
          setState({
              isLoading: false,
              alertMessage: processAlertSuccess('Email retrived successfully, kindly check your mail for a code to reset your password'),
          });
          setTimeout(function(){ 
              history.push('/enterpin');
            }, 3000);
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
                mainText="FORGOT YOUR PASSWORD?"
                secondaryText="Please enter your mail to recover your password"
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
                />
            </div>
            
            <div className="mb-4 w-100 d-flex justify-content-end ">
                <Link to="/login" className="text-right">  
                    Sign in
                </Link>
            </div>
            <div className="mb-4">
                <AuthButton 
                    className="facebook-sign-in-button"
                    text="CONTINUE"
                    disabled={isLoading}
                    loading={isLoading}
                    actionEvent={(e)=> submit(e)}
                />
            </div>
        </>
    )

};
export default ForgotPassword;