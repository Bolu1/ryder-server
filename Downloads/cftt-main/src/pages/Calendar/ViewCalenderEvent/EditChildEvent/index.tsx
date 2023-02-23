import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { EDIT_CHILD_EVENT } from 'GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const convertTime = (timeParam: any) => {
    var time = timeParam;
    var startTime = new Date();
    var parts = time.match(/(\d+):(\d+) (am|pm)/);
    if (parts) {
        var hours = parseInt(parts[1]),
            minutes = parseInt(parts[2]),
            tt = parts[3];
        if (tt === 'PM' && hours < 12) hours += 12;
        startTime.setHours(hours, minutes, 0, 0);
    }
    return startTime;
    
}

const EditChildEvent = (props: any):JSX.Element => {
    const params = useParams();
    const initialState = {
        formData: {
            eventTheme: props?.currentEvent?.eventTheme,
            day: `${props?.currentEvent?.day}`,
            time: convertTime(props?.currentEvent?.time)
        },
        adminData:[],
        errors:{},
        isLoading: false,
        alertMessage:{},
        formDayOptions: [],
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, formDayOptions} = state;
    const {show, toggleModal, daydifference, dayObject} = props;
    const [updateChildEvent, { data, loading, error }] = useMutation(EDIT_CHILD_EVENT);
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
            'eventTheme': 'required',
            'day' : 'required',  
            'time': 'required' 
        };

        const messages = {
            'eventTheme.required': 'Event theme is required',
            'day.required': 'Select a day',
            'time.required': 'Select a time'
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

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
           
            if(validate){
                const payload ={
                    ...formData,
                    time: moment(formData?.time).format('h:mm'),
                    day: parseInt(formData?.day),
                    // @ts-ignore
                    eventId: params?.id,
                };
                await updateChildEvent({variables:{childId: props?.currentEvent?._id, input:payload}});
                props.refresh(true);
               
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
                    day: newValue.value,
                },
                errors: {
                    ...state.errors,
                    day: '',
                },
            });
        }
      };
    const handleTimeChange = (e:Date) => {
        setState({
            formData: {
                ...formData,
                time:e
            },
        });
    };
    useEffect(() => {
      
        const arr =[];
        for (let index = 1; index <= daydifference; index++) {
            if(!dayObject[index]){
                arr.push({label: `${index}`, value: `${index}`});
            }
        };
        setState({
            formDayOptions: arr,
        });
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
            title="Edit child event"
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
                        <div className="w-100 mb-2">
                            <label className='calendar-input-label mb-2'>Event theme</label>
                        </div>
                        <FormGroupInput
                            placeholder="Event theme"
                            value={formData?.eventTheme}
                            onChange={handleChange}
                            name="eventTheme"
                            showError={errors.eventTheme}
                            errorMessage={errors.eventTheme}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <div className="w-100 mb-2">
                            <label className='calendar-input-label mb-2'>Select day</label>
                        </div>
                        <FormGroupSelect
                            placeholder="Select day"
                            name="day"
                            showError={errors.day}
                            errorMessage={errors.day}
                            onChange={handleSelectChange}
                            selectOptions={formDayOptions}
                            defaultValue={{label: formData?.day, value: formData?.day}}
                        />
                    </div>
                    <div className="col-md-12 mb-3 mt-2 d-flex selected-date-container align-items-center">
                                <div className="w-100 mb-2">
                                    <label className='calendar-input-label mb-2'>Choose time</label>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <TimePicker
                                            variant="inline"
                                            inputVariant="outlined"
                                            value={formData?.time}
                                            className="w-100"
                                            // @ts-ignore
                                            onChange={handleTimeChange}
                                            size='small'
                                            
                                            autoOk
                                        />
                                    </MuiPickersUtilsProvider>
                                    {errors.time && (
                                        <span className='text-danger'>{errors?.time}</span>
                                    )}
                                    
                                </div>
                               
                                
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
export default EditChildEvent;