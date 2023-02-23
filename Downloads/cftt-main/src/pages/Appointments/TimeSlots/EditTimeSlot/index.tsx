import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, parseTime, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import { UPDATE_TIME_SLOT } from 'GraphQl/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux';
import moment from 'moment';
import { GET_SINGLE_TIME_SLOT } from 'GraphQl/Queries';

const EditTimeSlot = (props: any):JSX.Element => {
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
    const {show, toggleModal, user, slotId, refresh } = props;
    const { fetchMore } = useQuery(GET_SINGLE_TIME_SLOT, {
        variables: {
          id: slotId
        },
    });

    const [updateTimeSlot, { data, loading, error }] = useMutation(UPDATE_TIME_SLOT);

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
            await updateTimeSlot({variables:{id: slotId, input:payload}});
            // toggleModal();
            refresh(true);
            props.addAlert(processAlertSuccess('Time slot updated successfully'));
            
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
    
    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({
                    variables: {
                        id: slotId
                    }
                });
         if(apiData.data){
            const { getSlot } = apiData?.data;
            setState({
                formData: {
                    endTime: parseTime(getSlot?.endTime),
                    startTime: parseTime(getSlot?.startTime),
                    date: new Date(getSlot?.startDate),
                }
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };

      useEffect(() => {
          fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const handleTimeChange = (e:Date, key: string) => {
        setState({
            formData: {
                ...formData,
                [key]:e
            },
        });
    };
    const handleEndDateChange = (e:Date) => {
        setState({
            formData: {
                ...formData,
                date:e
            },
        });
    };
  
    return(
        <>
            
            <Modal
                title="Update time slot"
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
                        <div className="col-md-12 mb-4">
                            <label className='calendar-input-label mb-2'>Select date</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    variant="inline"
                                    inputVariant="outlined"
                                    value={formData?.date}
                                    // @ts-ignore
                                    onChange={handleEndDateChange}
                                    size='small'
                                    format="MM/dd/yyyy"
                                    autoOk
                                    className='w-100'
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className='calendar-input-label mb-2'>Start time</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    variant="inline"
                                    inputVariant="outlined"
                                    value={formData?.startTime}
                                    className="w-100"
                                    // @ts-ignore
                                    onChange={(e) => handleTimeChange(e, 'startTime')}
                                    size='small'
                                    
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className='calendar-input-label mb-2'>End time</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <TimePicker
                                    variant="inline"
                                    inputVariant="outlined"
                                    value={formData?.endTime}
                                    className="w-100"
                                    // @ts-ignore
                                    onChange={(e) => handleTimeChange(e, 'endTime')}
                                    size='small'
                                    
                                    autoOk
                                />
                            </MuiPickersUtilsProvider>
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
function mapStateToProps(appState:any) {

    return {
       user: appState?.reducer?.userObject,
    };
 }
export default connect(mapStateToProps)(EditTimeSlot);