import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  apostleDeskCategoryOptions} from 'constants/index';
import { extractErrorMessage, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop, capiitalizeFirstLetter } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_MESSAGE, EDIT_PASTOR_FORUM_MESSAGE } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';
import { GET_ALL_ADMINS, GET_SINGLE_PASTORS_FORUM_MESSAGE } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';
import CloseButton from 'components/CloseButton';
import BackButton from 'utilComponents/BackButton';


const EditSermon = (props: any):JSX.Element => {
  
    const initialState = {
        formData: {
            title: '',
            message: '',
            minister: '',
            bibleReading:[],
            category:'',
            prayer_point:'',

        },
        payload:{},
        errors:{},
        bibleVerseData:[],
        isLoading: true,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [updateForumMessage, loadingParams] = useMutation(EDIT_PASTOR_FORUM_MESSAGE); 
    const {formData, isLoading, alertMessage, errors, preview, adminData, bibleVerseData} = state;
    const { fetchMore } = useQuery(GET_SINGLE_PASTORS_FORUM_MESSAGE, {
        variables: { id: props?.messageId}
    }); 
    const adminDataQuery = useQuery(GET_ALL_ADMINS, {
        variables: {
            page: 0,
            limit: 10000,
            query: ''
        },
    });
    
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

    const setTags = (newTags: String[]) => {
        setState({
            formData: {
                ...state.formData,
                bibleReading: newTags,
            },
            errors: {
                ...state.errors,
                bibleReading: '',
            },
        });
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

    const handlePrayerPointChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                prayer_point: data,
            },
            errors:{
                ...state.errors,
                prayer_point: '',
            }
        });
    };

    
    const validateFormData = async () => {
        const newFormData = {...formData};
        newFormData.bible_verse = newFormData.bibleReading[0];
        const rules = {
            'title': 'required',
            'minister': 'required',
            'message':'required',
            'bible_verse': 'required',
            'prayer_point': 'required',
        };

        const messages = {
            'title.required': 'Enter a title',
            'minister.required': 'Select a minister',
            'message.required': 'Message required',
            'bible_verse.required': 'Bible reading required',
            'prayer_point.required': 'Prayer points required',
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
                bibleReading:bibleVerseData,
            };
            await updateForumMessage({variables:{messageId: props?.messageId, input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Message updated successfully'),
            });
            scrollTop();
            setTimeout(function () {
                props.close(true);
            }, 1000);
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
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    };

    const fetchData = async() => {
        const apiData:any = await fetchMore({variables: { messageId: props?.messageId}});
        const {data, error, loading} = apiData;
        if(data){
            const response = data?.getMessageDetailFromPastorForum;
            const getBibleReading = () => {
                const returnArr = [];
                for (let index = 0; index < response?.bibleReading.length; index++) {
                    const element = response?.bibleReading[index];
                    returnArr.push(element?.refrence);
                };
                return returnArr;
            };
            setState({
                formData:{
                    title: response?.title,
                    message: response?.message,
                    minister: response?.minister,
                    bibleReading: getBibleReading(),
                    category: response?.category,
                    prayer_point: response?.prayer_point,
                },
                prayers: response?.prayer_point,
                isLoading:false,
            });
            
          
        };
        if(!loading){
            setState({
                isLoading: false,
            });
        };

        if(error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
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

    return(
        <>
            {!preview && (
                < div className="row justify-content-between align-items-start pt-4 px-4">
                 <div className="col-md-6">
                     <PageTitle text='Edit Forum Message' />
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
                        <br/>
                        <AlertComponent
                            text={alertMessage.text}
                            type={alertMessage.type}
                            onClose={handleAlertClose}
                        />
                    </>
                )}
                <div className=''>
                {isLoading? (
                    <>
                        <DivLoader />
                    </>
                ):(
                    <>
                        {!preview? (
                            <>
                                <div className="row  pt-4 px-4">
                                    <div className="col-md-12 mb-4">
                                        
                                        <FormGroupInput
                                            placeholder="Title of message"
                                            value={formData?.title}
                                            onChange={handleChange}
                                            name="title"
                                            showError={errors.title}
                                            errorMessage={errors.title}
                                        />
                                    </div>
                                    
                                    <div className="col-md-6 mb-4">
                                        <ReactTagInput 
                                            tags={formData?.bibleReading} 
                                            onChange={(newTags) => setTags(newTags)}
                                            placeholder='Type bible verse and press enter'
                                        />
                                        {errors.bible_verse && (
                                            <div className="small w-100 text-left text-danger">
                                                {errors.bible_verse}
                                            </div>
                                        )}
                                    </div>
                                

                                    
                                    <div className="col-md-6 mb-4">
                                        <FormGroupSelect
                                            placeholder="Select minister"
                                            onChange={(e: object)=>handleSelectChange(e, 'minister')}
                                            name="minister"
                                            showError={errors.minister}
                                            errorMessage={errors.minister} 
                                            selectOptions={adminData}
                                            defaultValue={{label: capiitalizeFirstLetter(formData?.minister), value:formData?.minister }}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-4">
                                    
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
                                    <div className="col-md-12 mb-3">
                                
                                        <h6 className='mb-2'>Add prayers to message</h6>
                                        <div className="col-md-12 mb-2">
                                            <TextEditor
                                                //@ts-ignore
                                                text={formData?.prayer_point}
                                                handleChange={handlePrayerPointChange}
                                                placeholder="Type prayer points"
                                            />
                                            {errors.prayer_point && (
                                                <div className="small w-100 text-left text-danger">
                                                    {errors.prayer_point}
                                                </div>
                                            )}
                                        </div>
                                    
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
                                <div className='col-md-12 p-0'>
                                    <div className='row'>
                                        <div className="col-md-12 d-flex justify-content-between align-items-start mb-4">
                                            <div>
                                                <PageTitle text='Review Message' />
                                            </div>
                                            
                                            <>
                                                <Badges
                                                    text={'Pending'}
                                                    type='pending'
                                                />
                                            </>
                                            
                                        </div>
                                        <div className='col-md-12'>
                                            <img src={missionIcon} />
                                        </div>

                                        <div className='col-md-12'>
                                            <div className="user-name px-2 mt-4">
                                                <h5 className="m-0 name">{formData?.title}</h5>
                                                <span className="small text-muted mt-4">By {formData?.minister}</span>
                                            </div> 
                                        </div>

                                        <div className='col-md-12'>
                                            <div className="user-name px-2 mt-4">
                                                <h5 className="m-0 name">Bible passages</h5>
                                                    {formData?.bibleReading.map((item:string, index:number) => {
                                                        return(
                                                            <>
                                                                <GetBiblePassage
                                                                    biblePassage={item}
                                                                    updatePassageText={upDateBibleVerseText}
                                                                    index={index}
                                                                />
                                                            </>
                                                        )
                                                    })}
                                            
                                            </div> 
                                        </div>

                                        <div className='col-md-12'>
                                            <div className="user-name px-2 mt-4">
                                                <h5 className="m-0 name">Message</h5>
                                            </div>
                                            <div 
                                                className="text-dark mt-1 small px-2 pl-3"
                                                dangerouslySetInnerHTML={{ __html: formData?.message || 'N/A' }}       
                                            /> 
                                        </div>

                                        <div className='col-md-12'>
                                            <div className="user-name px-2 mt-4">
                                                <h5 className="m-0 name">Prayer points</h5>
                                            </div>
                                            <div 
                                                className="text-dark mt-1 small px-2"
                                                dangerouslySetInnerHTML={{ __html: formData?.prayer_point || 'N/A' }}       
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
                                </div>
                                {/* <div className='col-md-5'>
                                    xxxx
                                </div> */}
                                
                            </div>
                        )}
                    </>
                )}
                    
                </div>
            </>
        
        
        </>
    )

};
export default EditSermon;
