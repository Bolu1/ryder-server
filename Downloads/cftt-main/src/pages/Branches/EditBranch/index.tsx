import React, {useReducer, useEffect} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import Map from 'utilComponents/MapComponent';
import { useMutation } from '@apollo/client';
import { UPDATE_BRANCH } from 'GraphQl/Mutations';
import { EditCircle } from 'tabler-icons-react';

class MapComponent extends React.Component <any> {
    state = {
        geoPoints:{
            lat: this.props?.geoPoints?.lat? Number(this.props?.geoPoints?.lat) : 18.5204,
            lng: this.props?.geoPoints?.long? Number(this.props?.geoPoints?.long) : 73.8567,
            address: this.props?.address || '',
        }
    };
    
    shouldComponentUpdate(nextProps:any, nextState: any){
        if(this.props?.geoPoints?.lat === nextProps.geoPoints?.lat){
          return false
        }else{
          return true
        }
      }
    onMapChange = (values:[], index= null, address: string) => {
        let values_2: Array<number> = values;
        const {updateMapProps} = this.props;
        this.setState({
            geoPoints: {
                lat: values_2[0],
                lng: values_2[1],
                address: address,
            }
        });
        updateMapProps({
            lat: values_2[0],
            lng: values_2[1],
            address: address,
        });
    }

    render = () => {
        return(
            <div className="col-md-12 mb-3">
                <Map 
                    google={this.props.google}
                    center={{lat: 18.5204, lng: 73.8567}}
                    height='300px'
                    zoom={15}
                    onMapChange={(value?:any,index?:any, address ?:any)=>this.onMapChange(value,index, address)}
                
                    lat={this.props?.geoPoints?.lat}
                    lng={this.props?.geoPoints?.lng}
                />
                         {/* {errors.address && (
                             <div className="small w-100 mt-5 text-left text-danger">
                                 {errors.address}
                             </div>
                         )} */}
            </div>
        )
    }
};


const EditBranch = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            name: props?.branch?.name || '',
            branch_president: props?.branch?.branch_president || '',
        },
        geoPoints:{
            lat: props?.branch?.geo_point?.lat? Number(props?.branch?.geo_point?.lat) : 18.5204,
            lng: props?.branch?.geo_point?.long? Number(props?.branch?.geo_point?.long) : 73.8567,
            address: props?.branch?.address || '',
        },
        errors:{},
        isLoading: false,
        pageLoading: false,
        alertMessage:{},
        showModal: false

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, geoPoints, showModal, pageLoading} = state;
    const {show, toggleModal} = props;
    const [updateBranch, { data, loading, error }] = useMutation(UPDATE_BRANCH);

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
   
    const onMapChange = (mapProps: any) => {
        setState({
            geoPoints: {...mapProps},
            errors: {
                ...state.errors,
                address: '',
            },
        });
    }

    const handleModalToggle = (refresh = null) => {
        setState({showModal: !showModal});
        if(refresh){
            refreshForm();
        }
        else{
            fetchData();
        }
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
        };
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
                 await updateBranch({variables:{input: payload, branchId: props?.branch._id}}); 
                
                refreshForm();
                props.addAlert(processAlertSuccess('Branch updated successfully'));
                // props.refresh();
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

    const fetchData = () => {
        const {branch} = props;
        setState({
            // ...state,
            formData: {
                name: props?.branch?.name || '',
                branch_president: props?.branch?.branch_president || '',
            },
            geoPoints:{
                lat: props?.branch?.geo_point?.lat? Number(props?.branch?.geo_point?.lat) : 18.5204,
                lng: props?.branch?.geo_point?.long? Number(props?.branch?.geo_point?.long) : 73.8567,
                address: props?.branch?.address || '',
            },
            // isLoading: false,
            // pageLoading: false
        });
    };
    
    useEffect(() => {
        // fetchData();

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
            title="Update Branch"
            show={showModal} 
            // @ts-ignore
            toggle={()=>handleModalToggle(true)}
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
                {pageLoading? (<> 
                </>): (
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
                     
                     <MapComponent geoPoints={geoPoints} updateMapProps={onMapChange} />
                     
                     <div className="col-md-12 mt-5 mb-3 d-flex justify-content-end">
                     <CreateButton
                         text={'Update'}
                         actionEvent={(e)=>{submit(e)}}
                         disabled={isLoading}
                         loading={isLoading}
                     />
                     </div>
                 </div>
                )}
               
            </>
        </Modal>
            <span 
                className={` pointer edit-button mx-3`}  
                onClick={()=>{handleModalToggle( )}}
            >   
                <EditCircle
                    className="button-icon"
                    size={20}
                    strokeWidth={1.5}
                    color={'#FFF'}
                />
            </span>
        </>
    )

};
export default EditBranch;