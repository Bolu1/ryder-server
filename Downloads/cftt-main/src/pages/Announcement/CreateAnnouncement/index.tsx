import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import AlertComponent from 'components/AlertComponent';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import DropZone from 'utilComponents/DropZone';
import FormGroupInput from 'utilComponents/FormGroupInput';
import CustomDatePicker from 'utilComponents/DatePicker';
import TextEditor from 'utilComponents/TextEditor';
import CreateButton from 'utilComponents/CreateButton';
import { formatDate } from 'utils';


const CreateAnnouncement = ():JSX.Element => {
    const initialState = {
        alertMessage:{},
        formData:{
                name: '',
                body:'',
                date: null,
        },
        errors:{},
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {errors, alertMessage, formData} = state;

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

    const handleTextChange = (value: string) :void  => {
       console.log(value);
    };
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_ADMINS);
    
            setState({
                data: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };

    const handleDateChange = (e:any):void => {
        if(e){
            const date = formatDate(e);
            setState({
                formData:{
                    ...formData,
                    date: date,
                }
            });
        }else{
            setState({
                formData:{
                    ...formData,
                    date: null,
                }
            });
        }
    };

    useEffect(() => {
        //fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
   
    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Create Announcement' />
        </div>
        
        </div>
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
            <div className="pt-1"/>
            <div className="shadow mx-3 my-2 ">
                <div className="row  py-4 px-4 justify-content-center">
                    <div className="col-md-6 mb-3">
                        <FormGroupInput
                            placeholder="Title of announcement"
                            value={formData?.name}
                            onChange={handleChange}
                            name="name"
                            showError={errors.name}
                            errorMessage={errors.name}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomDatePicker
                            value={formData?.date}
                            //@ts-ignore
                            onChange={(e:any)=>handleDateChange(e)}
                        />
                    </div>
                    <div className="col-md-12 mb-4">
                        <DropZone />
                    </div>
                    <div className="col-md-12">
                        <TextEditor
                            //@ts-ignore
                            handleTextChange={handleTextChange}
                            text={formData.body}
                        />
                    </div>

                </div>
            </div>
            <div className="pb-2"/>
            <CreateButton
                text={'Post now'}
                float
            />
        </div>
         
       
        </>
    )

};
export default CreateAnnouncement;