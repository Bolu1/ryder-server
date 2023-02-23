import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { CREATE_NEW_TIME_SLOT } from 'GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { connect } from 'react-redux';
import moment from 'moment';

const CreateTimeSlot = (props: any):JSX.Element => {
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
    const {show, toggleModal, user, refresh } = props;
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
                title="Create time slot"
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
export default connect(mapStateToProps)(CreateTimeSlot);