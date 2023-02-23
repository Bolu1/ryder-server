import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';

import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { useMutation, useQuery } from '@apollo/client';
import { CHANGE_ADMIN_ROLE, INVITE_ADMIN } from 'GraphQl/Mutations';
import { GET_ALL_ROLES } from 'GraphQl/Queries';

const ChangeAdminRole = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            id: '',
            role: '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal} = state;
    const {show, toggleModal, rolesArr, userId} = props;
    // Graphql
    const [changeRole, { data, loading, error }] = useMutation(CHANGE_ADMIN_ROLE); 
    const handleSelectChange = (e:{label?: string, value?: string|null|number}, name = '') :void  => {
        if (e) {
            setState({
                formData: {
                    ...state.formData,
                    [name]: e.value,
                },
                errors: {
                    ...state.errors,
                    [name]: '',
                },
            });
        }

    }

    const validateFormData = async () => {
        const rules = {
            'role': 'required',
        };

        const messages = {
            'role.required': 'Select a role',
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

    const refreshForm = () => {
        setState({
            formData: {
                role: '',
            },
            errors:{},
        })
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
                    // adminId: userId,
                    role: formData?.role
                };
                console.log(payload);
                await changeRole({variables: {input: payload, adminId: userId}})
                props.addAlert(processAlertSuccess('Role changed successfully'));
                toggleModal(true);
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

    useEffect(() => {

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    return(
        <>
        <Modal
            title="Change admin role"
            show={show} 
            toggle={toggleModal}
        >
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

                <div className="row">
                    
                    <div className="col-md-12 mb-3">
                        <FormGroupSelect
                                placeholder="Select role"
                                // value={formData?.role}
                                onChange={(e: object)=>handleSelectChange(e, 'role')}
                                name="role"
                                showError={errors.role}
                                errorMessage={errors.role} 
                                selectOptions={props?.rolesArr}
                                // label={'Select Role'}                        
                        />
                    </div>
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Submit'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </>
        </Modal>
        
        </>
    )

};
export default ChangeAdminRole;
