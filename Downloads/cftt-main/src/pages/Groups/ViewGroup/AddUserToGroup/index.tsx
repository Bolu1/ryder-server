import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess, validateImage } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { MESSAGE_IMAGE_UPLOAD } from 'GraphQl/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import { EditCircle } from 'tabler-icons-react';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { GET_ALL_MEMBERS } from 'GraphQl/Queries';


const AddUserToGroup = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            userID: '',
        },
        userData:[],
        errors:{},
        fileError:'',
        isLoading: false,
        alertMessage:{},
        showModal: false,
        file: null,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading, alertMessage, fileError, formData, errors, userData} = state;
    const {showModal, toggleModal} = props;
    // Graphql
    const userDataQuery = useQuery(GET_ALL_MEMBERS);

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

    };

    const validateFormData = async () => {
        const newFormData = {...formData};
       
        const rules = {
            'userID': 'required',
        };

        const messages = {
            'userID.required': 'Select an option',
        };
        const validate = await validateData(newFormData, rules, messages);
      
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
                props.addAlert(processAlertSuccess('User added to group successfully'));
                toggleModal();
                
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
        if(userDataQuery.data){
            const adminList:any = JSON.parse(JSON.stringify(userDataQuery.data.getAllAdmin));
            for (let index = 0; index < adminList.length; index++) {
                const element = adminList[index];
                element.label = element?.full_name;
                element.value = element?.full_name;
            };
            setState({
                userData: adminList,
            
            });
        };
        if(!userDataQuery.loading){
            setState({
                isLoading: false,
            });
        };

        if(userDataQuery.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(userDataQuery.error)),
            });
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [userDataQuery.data]);
  
    return(
        <>
        <Modal
            title="Add user to group"
            show={showModal} 
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
                            placeholder="Select member"
                            onChange={(e: object)=>handleSelectChange(e, 'userID')}
                            name="userID"
                            showError={errors.userID}
                            errorMessage={errors.userID} 
                            selectOptions={userData}
                        />
                    </div>
                    {fileError &&(
                        <div className='text-danger'>
                            {fileError}
                        </div>
                    )}
                    
                    
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Upload Image'}
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
export default AddUserToGroup;