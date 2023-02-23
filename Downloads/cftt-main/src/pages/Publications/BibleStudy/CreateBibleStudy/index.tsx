import React, {useReducer, useEffect } from 'react';
import { extractErrorMessage, formatDate, isNotEmptyArray, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_BIBLE_STUDY } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import GetBiblePassage from 'components/GetBiblePassage';
import CloseButton from 'components/CloseButton';
import { GET_ALL_ADMINS } from 'GraphQl/Queries';
import CustomDatePicker from 'utilComponents/DatePicker';

const CreateBibleStudy = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            topic: '',
            message: '',
            minister: '',
            memoryVerse:'',
            date:'',

        },
        payload:{},
        errors:{},
        bibleVerseData:{},
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [createNewBibleStudy, { data, loading, error }] = useMutation(CREATE_BIBLE_STUDY); 
    const adminDataQuery = useQuery(GET_ALL_ADMINS, {
        variables: {
            page: 0,
            limit: 10000,
            query: ''
        },
    });
    const {formData, isLoading, alertMessage, errors, preview, adminData,  bibleVerseData} = state;

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
            await createNewBibleStudy({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Bible study saved successfully'),
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

    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        // bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: {...bibleVerseObj},
        })
    };

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
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [adminDataQuery.data]);

    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-center pt-3">
                    <div className="col-md-6">
                        <PageTitle text='Create Bible Study' />
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

                            {/* <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Bible text"
                                    value={formData?.bibleText}
                                    onChange={handleChange}
                                    name="bibleText"
                                    showError={errors.bibleText}
                                    errorMessage={errors.bibleText}
                                />
                            </div> */}
                 
                            <div className="col-md-6 mb-1">
                                <FormGroupSelect
                                    placeholder="Select minister"
                                    label="Select minister"
                                    onChange={(e: object)=>handleSelectChange(e, 'minister')}
                                    name="minister"
                                    showError={errors.minister}
                                    errorMessage={errors.minister} 
                                    selectOptions={adminData}
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
                        <div className="col-md-5 d-flex justify-content-between align-items-center ">
                            <div>
                                <PageTitle text='Review bible study' />
                            </div>
                            
                            <>
                                <Badges
                                    text={'Pending'}
                                    type='pending'
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
                                text={'Submit'}
                                actionEvent={(e)=>{submitPreview(e)}}
                                disabled={isLoading}
                                loading={isLoading}
                            />
                        </div>

                    </div>
                )}
                
                </div>
            </>
        
        
        </>
    )

};
export default CreateBibleStudy;
