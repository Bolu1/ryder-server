import React, {useReducer} from 'react';
import AlertComponent from 'components/AlertComponent';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from 'GraphQl/Mutations';
const ChangePassword = ():JSX.Element => {
    const initialState = {
        formData: {
            confirm_password: '',
            new_password:'',
            old_password: '',
        },
        errors:{},
        alertMessage:{},
        data:{},
        isLoading: false,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, page, isLoading, alertMessage, errors} = state;
    const [changePassword, loadingParams] = useMutation(CHANGE_PASSWORD); 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) :void  => {
        const {name, value} = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            errors:{
                ...state.errors,
                [name]: '',
            }
        });
    };

    const validateFormData = async () => {
        const rules = {
            'confirm_password': 'required',
            'new_password' : 'required',
            'old_password' : 'required',      
        };

        const messages = {
            'old_password.required': 'Old password is required',
            'new_password.required': 'New password is required',
            'confirm_password.required': 'Confirmation is required',
        };
        let validate = await validateData(formData, rules, messages);
        if(formData.confirm_password.trim()){
            if(formData.confirm_password !== formData.new_password){
                    validate = {...validate, confirm_password: 'New password and confirmation should match'};
            }
        }
        
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            
            setState({
                ...state,
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
            
                    const payload = {
                        newPassword: formData.new_password,
                        oldPassword: formData.old_password,
                      
                    };
            
                    await changePassword({variables: payload})
                    setState({
                        isLoading: false,
                        alertMessage: processAlertSuccess('Password updated successfully'),
                    }); 
                   
                 
               
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
    const handleAlertClose = ():void => {
        setState({
            alertMessage:{},
        });
    };

    return(
        <>
         
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        <div className="bg-white">
           
            <div className="row mt-5">
                <div className="col-md-12 mb-3">
                    <FormGroupInput
                        placeholder="Old password"
                        value={formData?.old_password}
                        onChange={handleChange}
                        name="old_password"
                        showError={errors.old_password}
                        errorMessage={errors.old_password}
                        type="password"
                    />
                </div>
                <div className="col-md-12 mb-3">
                    <FormGroupInput
                        placeholder="New password"
                        value={formData?.new_password}
                        onChange={handleChange}
                        name="new_password"
                        showError={errors.new_password}
                        errorMessage={errors.new_password}
                        type="password"
                    />
                </div>
                <div className="col-md-12 mb-3">
                    <FormGroupInput
                        placeholder="Confirm password"
                        value={formData?.confirm_password}
                        onChange={handleChange}
                        name="confirm_password"
                        showError={errors.confirm_password}
                        errorMessage={errors.confirm_password}
                        type="password"
                    />
                </div>
                
                <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                
                    <CreateButton
                        text={'Update password'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
            </div>
        </div>
        </>
    )

};
export default ChangePassword;