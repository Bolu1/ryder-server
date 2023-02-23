import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import Map from 'utilComponents/MapComponent';
import Creatable, { useCreatable } from 'react-select/creatable';
import { useMutation } from '@apollo/client';
import { CREATE_BRANCH } from 'GraphQl/Mutations';

const CreateBranch = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            name: '',
            branch_president:'',
        },
        geoPoints:{
            lat: 18.5204,
            lng: 73.8567,
            address: '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, geoPoints} = state;
    const [createNewBranch, { data, loading, error }] = useMutation(CREATE_BRANCH);
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

   
    const onMapChange = (values:[], index= null, address: string) => {
        let values_2: Array<number> = values;
        setState({
            geoPoints: {
                lat: values_2[0],
                lng: values_2[1],
                address: address,
            },
            errors: {
                ...state.errors,
                address: '',
            },
        });
    }

    const handleModalToggle = () => {
        setState({showModal: !showModal});
        refreshForm();
    }

    const validateFormData = async () => {
        const rules = {
            'name': 'required',
            'branch_president' : 'required',
            'address': 'required',    
        };

        const messages = {
            'address.required': 'Address required',
            'name.required': 'Branch name is required',
            'branch_president.required': 'Branch president is required',
        };
        const data = {
            ...formData,
            address: geoPoints?.address
        }
        const validate = await validateData(data, rules, messages);
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
                branch_president:'',
            },
            geoPoints:{
                lat: 18.5204,
                lng: 73.8567,
                address: '',
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
            const payload = {
                name: formData?.name,
                branch_president: formData?.branch_president,
                geo_point:{
                    lat: `${geoPoints?.lat}`,
                    long: `${geoPoints?.lng}`,
                },
                branch_address: geoPoints?.address,
            };
            if(validate){
                const branchData = await createNewBranch({variables:{input: payload}}); 
                
                refreshForm();
                props.addAlert(processAlertSuccess('Branch added successfully'));
                props.refresh();
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
  
    return(
        <>
        <Modal
            title="Create Branch"
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
                            placeholder="Branch name"
                            value={formData?.name}
                            onChange={handleChange}
                            name="name"
                            showError={errors.name}
                            errorMessage={errors.name}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Branch president"
                            value={formData?.branch_president}
                            onChange={handleChange}
                            name="branch_president"
                            showError={errors.branch_president}
                            errorMessage={errors.branch_president}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <Map 
                            google={props.google}
                            center={{lat: 18.5204, lng: 73.8567}}
                            height='300px'
                            zoom={15}
                            onMapChange={(value?:any,index?:any, address ?:any)=>onMapChange(value,index, address)}
                           
                            lat={geoPoints?.lat}
                            lng={geoPoints?.lng}
                        />
                        {errors.address && (
                            <div className="small w-100 mt-5 text-left text-danger">
                                {errors.address}
                            </div>
                        )}
                    </div>
                    
                    <div className="col-md-12 mt-5 mb-3 d-flex justify-content-end">
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
            text={'Create Branch'}
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </>
    )

};
export default CreateBranch;