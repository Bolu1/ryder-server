import React, {useReducer} from 'react';
import WelcomeHeader from 'components/Auth/WelcomeHeader/index';
import AuthButton from 'components/Auth/AuthButton';
import { Link } from 'react-router-dom';
import PinInput from 'components/Auth/PinInput';
import AuthFormInputs from 'components/Auth/AuthFormInputs';
import mailIcon from 'assets/images/mail.svg';
import { validateData } from 'helpers';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { history } from 'helpers';
import { useMutation } from '@apollo/client';
import { CONFIRM_PASSWORD} from 'GraphQl/Mutations';

const EnterPin = ():JSX.Element => {
    const initialState = {
        formData: {
            pin_1: '',
            pin_2: '',
            pin_3: '',
            pin_4: '',
            new_password: '',
        },
        showNewPassword: false,
        errors:{},
        pinError: false,
        isLoading: false,
        alertMessage:{},

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showNewPassword, pinError} = state;
    const [attemptConfirmPassword, { data, loading, error }] = useMutation(CONFIRM_PASSWORD);
    const handlePinChange = async (e: React.SyntheticEvent & { target: HTMLInputElement})=> {

        const {name, value } = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            pinError: false,
        });
        let nextElementIndex = 0;
        const inputs = document.getElementsByTagName("input");
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            const elementName = element.getAttribute("name");
            if(name === elementName){
                nextElementIndex = index + 1;  
            }
        }
        if((inputs[nextElementIndex]) && (value)){
            inputs[nextElementIndex].focus();
        }
        
    };

    const validatePinInputs = () => {
        const newformData: any = {
            pin_1: formData.pin_1,
            pin_2: formData.pin_2,
            pin_3: formData.pin_3,
            pin_4: formData.pin_4,
        };
        for (const key in newformData) {
            if (Object.prototype.hasOwnProperty.call(newformData, key)) {
                const element = newformData[key];
                if(!element){
                    setState({
                        pinError: true,
                    });
                    return false;
                }
                
            }
        }
        return true;
    };

    const pinEntryComplete = (e: React.SyntheticEvent):void => {
        e.preventDefault();
        const validatePin = validatePinInputs();
        if(validatePin){
            if(!showNewPassword){
                setState({
                    showNewPassword: !showNewPassword,
                });
            }
        };
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const rules = {
            'new_password' : 'required',
        };

        const messages = {
            'new_password.required': 'Password required',
        };
        const validate = await validateData(formData, rules, messages);
        if (isObjectEmpty(validate)) {
            // processDataSubmit();
        } else {
            setState({
                errors: validate,
            });
        }
    };

    const processDataSubmit = async(e: React.SyntheticEvent) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const payload = {
                code: `${formData.pin_1}${formData.pin_2}${formData.pin_3}${formData.pin_4}`,
                new_password: formData?.new_password,
            };
            await attemptConfirmPassword({variables:{new_password: payload?.new_password, code: payload?.code}});
        
            setState({
                isLoading: false,
                alertMessage: processAlertSuccess('Password reset was successfully, kindly login with your new credentials'),
            });
            setTimeout(function(){ 
                history.push('/login');
              }, 3000);

        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
    };

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

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    return(
        <>
            <WelcomeHeader 
                mainText={showNewPassword? 'ENTER NEW PASSWORD':"VERIFY YOUR EMAIL"}
                secondaryText={showNewPassword? "Reset your password":"Please enter the 4 digit pin that was sent to your mail"}
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
            
            <div className="my-3  row justify-content-center">
                {!showNewPassword? (
                    <>
                        <div className="col-md-2">
                            <PinInput 
                                name="pin_1"
                                actionEvent={handlePinChange}
                                value={formData.pin_1}
                            />
                        </div>
                        <div className="col-md-2">
                            <PinInput 
                                name="pin_2"
                                actionEvent={handlePinChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <PinInput 
                                name="pin_3"
                                actionEvent={handlePinChange}
                            />
                        </div>
                        <div className="col-md-2">
                            <PinInput 
                                name="pin_4"
                                actionEvent={handlePinChange}
                            />
                        </div>
                        
                    </>
                ): (
                    <>
                    <div className="mb-3">
                        <AuthFormInputs
                            icon={mailIcon}
                            placeholder={'Password'}
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            type="password"
                            showError={errors.new_password}
                            errorMessage={errors.new_password}
                        />
                    </div>
                    </>
                )}
                {pinError && (
                    <div className="col-md-12 my-2">
                        <div className="text-danger">
                            All pin fields are required
                        </div>
                    </div>
                )}
                
               
            </div>
            
            <div className="mb-4 w-100 d-flex justify-content-end ">
                <Link to="/login" className="text-right">  
                    Sign in
                </Link>
            </div>
            <div className="mb-4">
                {!showNewPassword? (
                    <AuthButton 
                        className="facebook-sign-in-button"
                        text="NEXT"
                        actionEvent={(e)=> pinEntryComplete(e)}
                    />
                ):(
                    <AuthButton 
                        className="facebook-sign-in-button"
                        text="NEXT"
                        disabled={isLoading}
                        loading={isLoading}
                        actionEvent={(e)=> processDataSubmit(e)}
                    />
                )}
            </div>
        </>
    )

};
export default EnterPin;