import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { CREATE_GROUP } from 'GraphQl/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import FormSelectOrCreate from 'utilComponents/FormSelectOrCreate';
import { GET_ALL_ADMINS } from 'GraphQl/Queries';


const CreateGroup = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            name: '',
            group_head:'',
        },
        adminData:[],
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, adminData} = state;
    const [createNewGroup, { data, loading, error }] = useMutation(CREATE_GROUP);
    const adminDataQuery = useQuery(GET_ALL_ADMINS); 
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


    const handleModalToggle = () => {
        setState({showModal: !showModal});
        refreshForm();
    }

    const validateFormData = async () => {
        const rules = {
            'name': 'required',
            'group_head' : 'required',   
        };

        const messages = {
            'name.required': 'Group name is required',
            'group_head.required': 'Group head is required',
        };
        const validate = await validateData(formData, rules, messages);
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

    const refreshForm = () => {
        setState({
            formData: {
                name: '',
                group_head:'',
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
                const newGroup = await createNewGroup({variables:{input:formData}});
                refreshForm();

                props.refresh(newGroup?.data?.createGroup);
                props.addAlert(processAlertSuccess('Group added successfully'));
                handleModalToggle();
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

    const handleSelectChange = (
        newValue: any,
        actionMeta: any,
      ) => {
        if (newValue) {
            setState({
                formData: {
                    ...state.formData,
                    group_head: newValue.value,
                },
                errors: {
                    ...state.errors,
                    group_head: '',
                },
            });
        }
      };
    const  handleInputChange = (inputValue: any, actionMeta: any) => {
        if (inputValue) {
            setState({
                formData: {
                    ...state.formData,
                    group_head: inputValue,
                },
                errors: {
                    ...state.errors,
                    group_head: '',
                },
            });
        }
        
      };
      useEffect(() => {
        
        if(adminDataQuery.data){
            const adminList:any = JSON.parse(JSON.stringify(adminDataQuery.data.getAllAdmin));
            for (let index = 0; index < adminList.length; index++) {
                const element = adminList[index];
                element.label = element?.full_name;
                element.value = element?.full_name;
            };
            setState({
                adminData: adminList,
            });
        };

        if(adminDataQuery.error){
            setState({
                alertMessage:processAlertError(extractErrorMessage(adminDataQuery.error)),
            })
        }
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [adminDataQuery.data]);
  
    return(
        <>
        <Modal
            title="Create Group"
            show={showModal} 
            toggle={handleModalToggle}
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
                        <FormGroupInput
                            placeholder="Group name"
                            value={formData?.name}
                            onChange={handleChange}
                            name="name"
                            showError={errors.name}
                            errorMessage={errors.name}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormSelectOrCreate
                            placeholder="Group head"
                            name="group_head"
                            showError={errors.group_head}
                            errorMessage={errors.group_head}
                            onChange={handleSelectChange}
                            // @ts-ignore
                            onInputChange={handleInputChange}
                            selectOptions={adminData}
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
        <CreateButton
            text={'Create Group'}
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </>
    )

};
export default CreateGroup;