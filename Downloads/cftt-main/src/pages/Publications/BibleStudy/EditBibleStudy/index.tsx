import React, {useReducer, useEffect } from 'react';
import { extractErrorMessage, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop, formatDate } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import { useMutation, useQuery } from '@apollo/client';
import {  UPDATE_BIBLE_STUDY } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import CloseButton from 'components/CloseButton';
import { GET_ALL_ADMINS, GET_SINGLE_BIBLE_STUDY_CONTENT } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';
import CustomDatePicker from 'utilComponents/DatePicker';
import GetBiblePassage from 'components/GetBiblePassage';
import BackButton from 'utilComponents/BackButton';

const EditBibleStudy= (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            topic: '',
            message: '',
            minister: '',
            memoryVerse:'',
            date: null,
        },
        payload:{},
        errors:{},
        bibleVerseData:{},
        isLoading: true,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [updateBibleStudy, { data, loading, error }] = useMutation(UPDATE_BIBLE_STUDY); 
    const adminDataQuery = useQuery(GET_ALL_ADMINS, {
        variables: {
            page: 0,
            limit: 10000,
            query: ''
        },
    });
    const {fetchMore} = useQuery(GET_SINGLE_BIBLE_STUDY_CONTENT, {
        variables: { bibleStudyContentId: props?.bibleStudyId}
    });
   
    const {formData, isLoading, alertMessage, errors, preview, adminData, bibleVerseData} = state;

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


    const handleEditorChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                message: data,
            },
            errors:{
                ...state.errors,
                message: '',
            }
        });
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

    const validateFormData = async () => {
        const newFormData = {...formData};
        
        const rules = {
            'topic': 'required',
            'minister': 'required',
            'message':'required',
            'memoryVerse': 'required',
            'date': 'required',
        };

        const messages = {
            'topic.required': 'Enter a topic',
            'minister.required': 'Select a minister',
            'message.required': 'Message required',
            'memoryVerse.required': 'Memory verse required',
            'date.required': 'Date required',
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
        const validate = await validateFormData();
        if(validate){
            
            setState({
                preview: true,
                isLoading: false,
            });
            
        };
        
    };
    const submitPreview = async (e: React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        });
        try {
            const payload = {
                ...formData,
                memoryVerse: bibleVerseData,
            };
            await updateBibleStudy({variables:{biibleStudyContentId: props?.bibleStudyId, input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Bible study updated successfully'),
            });
            scrollTop();
            setTimeout(function () {
                props.close();
            }, 2000);
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

    const fetchData = async() => {
        try {
            
            const response = await fetchMore({variables: { messageId: props?.messageId}});
            const {data, error}:any = response;
            if(data){
                const responseData= data?.getBibleStudyContent;
               
                setState({
                    formData: {
                        topic: responseData?.topic,
                        message: responseData?.message,
                        minister: responseData?.minister,
                        memoryVerse: responseData?.memoryVerse?.refrence,
                        date:responseData?.publishedAt,
            
                    },
                    isLoading: false,
                
                });   
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                    isLoading: false,
                })
            }
        } catch (error) {
            const errMsg = extractErrorMessage(error);
            setState({
                alertMessage :processAlertError(extractErrorMessage(errMsg)),
                isLoading: false,
            })
        }
    }

    useEffect(() => {
        
        if(adminDataQuery.data){
            const adminList:any = JSON.parse(JSON.stringify(adminDataQuery.data.getAllAdmin?.docs));
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
        fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [adminDataQuery.data]);

    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        // bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: {...bibleVerseObj},
        })
    };

    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-center pt-3">
                    <div className="col-md-6">
                        <PageTitle text='Update Bible Study' />
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <CloseButton 
                            close={props.close}
                        />
                    </div>
                </div>
            )}
           
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
                {isLoading? (
                    <>
                        <DivLoader />
                    </>
                ):(
                    <div className=''>

                    {!preview? (
                        <>
                            <div className="row  pt-2">
                                <div className="col-md-6 mb-4">
                                    <FormGroupInput
                                        placeholder="Bible reading topic"
                                        value={formData?.topic}
                                        onChange={handleChange}
                                        name="topic"
                                        showError={errors.topic}
                                        errorMessage={errors.topic}
                                    />
                                </div>

                                <div className="col-md-6 mb-4">
                                    <FormGroupInput
                                        placeholder="Memory verse"
                                        value={formData?.memoryVerse}
                                        onChange={handleChange}
                                        name="memoryVerse"
                                        showError={errors.memoryVerse}
                                        errorMessage={errors.memoryVerse}
                                    />
                                </div>
                    
                                <div className="col-md-6 mb-1">
                                    <FormGroupSelect
                                        placeholder="Select minister"
                                        label="Select minister"
                                        onChange={(e: object)=>handleSelectChange(e, 'minister')}
                                        name="minister"
                                        showError={errors.minister}
                                        errorMessage={errors.minister} 
                                        selectOptions={adminData}
                                        defaultValue={{label: formData?.minister, value: formData?.minister}}
                                    />
                                </div>
                                
                                <div className="col-md-6 mb-4">
                                    <label>Select a date</label>
                                    <CustomDatePicker
                                        value={formData?.date}
                                        //@ts-ignore
                                        onChange={(e:any)=>handleDateChange(e)}
                                        dayPlaceholder='Select'
                                        monthPlaceholder='a'
                                        yearPlaceholder='date'
                                        showError={errors.date}
                                        errorMessage={errors.date}
                                    />
                                </div>

                                <div className="col-md-12 mb-1">
                                <h6 className='mb-2'>Type message</h6>
                                    <TextEditor
                                        //@ts-ignore
                                        text={formData?.message}
                                        handleChange={handleEditorChange}
                                        placeholder="Type message content"
                                    />
                                    {errors.message && (
                                        <div className="small w-100 text-left text-danger">
                                            {errors.message}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                                    <CreateButton
                                        text={'Proceed'}
                                        actionEvent={(e)=>{submit(e)}}
                                        disabled={isLoading}
                                        loading={isLoading}
                                    />
                                </div>
                            </div>
                        </>
                    ): (
                        <div className='row p-4'>
                            <div className='col-md-12 px-0 py-2'>
                                    <BackButton close={()=> setState({preview : !preview})} />
                            </div>
                            <div className="col-md-12 d-flex justify-content-between align-items-center ">
                                <div>
                                    <PageTitle text='Review bible study update' />
                                </div>
                                
                                <>
                                    <Badges
                                        text={'Published'}
                                        type='success'
                                    />
                                </>
                                
                            </div>
                            
                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name">{formData?.topic}</h5>
                                    <span className="small text-muted mt-4">By {formData?.minister}</span>
                                </div> 
                            </div>
                            

                            <div className='col-md-12'>
                            <div className=" px-2 mt-3">
                                <h5 className="m-0 name">Memory verse</h5>
                                <p className='font-italic'>
                                    <GetBiblePassage
                                        biblePassage={formData?.memoryVerse}
                                        updatePassageText={upDateBibleVerseText}
                                        index={null}
                                    />
                                </p> 
                               
                            </div> 
                        </div>


                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name">Message</h5>
                                </div>
                                <div 
                                    className="text-dark mt-1 small px-2"
                                    dangerouslySetInnerHTML={{ __html: formData?.message || 'N/A' }}       
                                /> 
                            </div>

                            

                            <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                                <CreateButton
                                    text={'Update'}
                                    actionEvent={(e)=>{submitPreview(e)}}
                                    disabled={isLoading}
                                    loading={isLoading}
                                />
                            </div>

                        </div>
                    )}
                    
                    </div>
                )}
            </>
        
        
        </>
    )

};
export default EditBibleStudy;
