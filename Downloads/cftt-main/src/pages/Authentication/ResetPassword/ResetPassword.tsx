import React, {useReducer} from 'react';
import WelcomeHeader from 'components/Auth/WelcomeHeader/index';
import AuthButton from 'components/Auth/AuthButton';
import AuthFormInput from 'components/Auth/AuthFormInputs';
import mailIcon from 'assets/images/mail.svg';
import { Link } from 'react-router-dom';

const ResetPassword = ():JSX.Element => {

    return(
        <>
            <WelcomeHeader 
                mainText="RESET PASSWORD"
                secondaryText="Please enter a new password"
            />
           
            <div className="mb-3">
                <AuthFormInput
                    icon={mailIcon}
                    placeholder={'Password'}
                />
            </div>
            <div className="mb-3">
                <AuthFormInput
                    icon={mailIcon}
                    placeholder={'Confirm Password'}
                />
            </div>
            
            <div className="mb-4">
                <AuthButton 
                    className="facebook-sign-in-button"
                    text="RESET PASSWORD"
                    actionEvent={(e)=> console.log(e)}
                />
            </div>
        </>
    )

};
export default ResetPassword;