import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import { CREATE_NEW_TIME_SLOT } from 'GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import { connect } from 'react-redux';
import moment from 'moment';

const ViewAppointment = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            endTime: new Date(),
            startTime: new Date(),
            date: new Date(),
        },
        adminData:[],
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, adminData} = state;
    const {show, toggleModal, user, refresh, appointment } = props;
    const [createNewTimeSlot, { data, loading, error }] = useMutation(CREATE_NEW_TIME_SLOT);

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const payload = {
                startDate: formData?.date,
                endDate: formData?.date,
                endTime: moment(formData?.endTime).format("hh:mm a"),
                startTime: moment(formData?.startTime).format("hh:mm a"),
                adminID: user?.id
            };
            await createNewTimeSlot({variables:{input:payload}});
            refresh(true);
            props.addAlert(processAlertSuccess('Time slot added successfully'));
            
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
                title="View Appointment"
                show={show} 
                toggle={toggleModal}
            >
                <>
                    <div className='row mb-2'>
                        <div className='col-md-3'>
                            Name :
                        </div>
                        <div className='col-md-9'>
                            {appointment?.name}
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-md-3'>
                            Email :
                        </div>
                        <div className='col-md-9'>
                            {appointment?.email}
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-md-3'>
                            Description :
                        </div>
                        <div className='col-md-9'>
                            {appointment?.agendaDescription}
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-md-3'>
                            Date :
                        </div>
                        <div className='col-md-9'>
                            {moment(appointment?.slot?.startDate).format('LL')}
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-md-3'>
                            Time :
                        </div>
                        <div className='col-md-9'>
                            {appointment?.slot?.startTime} - {appointment?.slot?.endTime}
                        </div>
                    </div>
                    
                    {/* <div className="col-md-12 mt-4 mb-3 d-flex justify-content-end">
                        <CreateButton
                            text={'Cancel appointment'}
                            actionEvent={(e)=>{submit(e)}}
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div> */}
                </>
            </Modal>
        </>
    )

};
function mapStateToProps(appState:any) {

    return {
       user: appState?.reducer?.userObject,
    };
 }
export default connect(mapStateToProps)(ViewAppointment);