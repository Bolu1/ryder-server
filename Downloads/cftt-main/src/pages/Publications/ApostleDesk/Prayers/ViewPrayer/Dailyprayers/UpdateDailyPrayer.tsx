import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop, getScripture, getSupportingVerses } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation } from '@apollo/client';
import { EDIT_DAILY_PRAYER } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import GetBiblePassage from 'components/GetBiblePassage';
import CloseButton from 'components/CloseButton';

const EditDailyPrayer = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            heading: props?.dailyPrayer?.heading,
            subtitle:  props?.dailyPrayer?.subtitle,
            day: props?.dailyPrayer?.day,
            content: props?.dailyPrayer?.content,
            scripture: getScripture(props?.dailyPrayer?.scripture),
            supportingVerse: getSupportingVerses(props?.dailyPrayer?.supportingVerse),
            prayerPoints: props?.dailyPrayer?.prayer_points,

        },
        payload:{},
        errors:{},
        bibleVerseData:{},
        supportVerseData:[],
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [updateDailyPrayer, { data, loading, error }] = useMutation(EDIT_DAILY_PRAYER); 
    const {formData, isLoading, alertMessage, errors, preview,  bibleVerseData, supportVerseData} = state;

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
   
    const setTags = (newTags: String[], type:any) => {
        setState({
            formData: {
                ...state.formData,
                [type]: newTags,
            },
            errors: {
                ...state.errors,
                [type]: '',
            },
        });
    };

    const handleEditorChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                content: data,
            },
            errors:{
                ...state.errors,
                content: '',
            }
        });
    };

    const handlePrayerPointChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                prayerPoints: data,
            },
            errors:{
                ...state.errors,
                prayerPoints: '',
            }
        });
    };


    
    const validateFormData = async () => {
        const newFormData = {...formData};
        newFormData.supportingVerse = newFormData.supportingVerse[0];
        const rules = {
            'heading': 'required',
            'subtitle' : 'required',
            'day': 'required',
            'supportingVerse': 'required',
            'content':'required',
            'scripture': 'required',
            'prayerPoints': 'required',
        };

        const messages = {
            'heading.required': 'Enter a header',
            'subtitle.required': 'Enter a subtitle',
            'day.required': 'Choose a day',
            'content.required': 'Content required',
            'supportingVerse.required':'Supporting verse required',
            'scripture.required': 'Scripture required',
            'prayerPoints.required': 'Prayer points required',
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
                day: parseInt(formData?.day),
                scripture:  bibleVerseData,
                supportingVerse:supportVerseData,
                prayerMannerId: props?.prayerId,

            };
            await updateDailyPrayer({variables:{input: payload, dailyPrayerId: props?.dailyPrayer?._id}});
            setState({
                alertMessage:  processAlertSuccess('Daily Prayer updated successfully'),
            });
            scrollTop();
            props.close(true)
            
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
      if(bibleVerseObj){
        setState({
            bibleVerseData: bibleVerseObj,
        })
      }
       
    }
    const updateSupportVerseText = (bibleVerseObj:any, index:number) => {
        if(bibleVerseObj){
          supportVerseData[index] = bibleVerseObj;
          setState({
            supportVerseData: [...supportVerseData],
          })
        }
         
      }

    useEffect(() => {
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
    console.log(formData, 'formdata');
    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-start pt-3 broder-top">
                    <div className="col-md-6">
                        <PageTitle text='Update Daily Prayer' />
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
                        <div className="col-md-12 mb-4">
                                <FormGroupInput
                                    placeholder="Heading"
                                    value={formData?.heading}
                                    onChange={handleChange}
                                    name="heading"
                                    showError={errors.heading}
                                    errorMessage={errors.heading}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Subtitle"
                                    value={formData?.subtitle}
                                    onChange={handleChange}
                                    name="subtitle"
                                    showError={errors.subtitle}
                                    errorMessage={errors.subtitle}
                                />
                            </div>

                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Choose a day"
                                    value={formData?.day}
                                    onChange={handleChange}
                                    name="day"
                                    showError={errors.day}
                                    errorMessage={errors.day}
                                />
                            </div>
                            
                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Scripture"
                                    value={formData?.scripture}
                                    onChange={handleChange}
                                    name="scripture"
                                    showError={errors.scripture}
                                    errorMessage={errors.scripture}
                                />
                                {/* <ReactTagInput 
                                    tags={formData?.scripture} 
                                    onChange={(newTags) => setTags(newTags, 'scripture')}
                                    placeholder='Type bible verse and press enter'
                                />
                                {errors.scripture && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.scripture}
                                    </div>
                                )} */}
                            </div>

                            
                            
                            <div className="col-md-6 mb-4">
                                <ReactTagInput 
                                    tags={formData?.supportingVerse} 
                                    onChange={(newTags) => setTags(newTags, 'supportingVerse')}
                                    placeholder='Type supporting verses and press enter'
                                />
                                {errors.supportingVerse && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.supportingVerse}
                                    </div>
                                )}
                            </div>
                          
                            

                            <div className="col-md-12 mb-4">
                            <h6 className='mb-2'>Type content</h6>
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.content}
                                    handleChange={handleEditorChange}
                                    placeholder="Type  content"
                                />
                                {errors.content && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.content}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-12 mb-1">
                        
                                <h6 className='mb-2'>Add prayer points</h6>
                                <div className="col-md-12 mb-2">
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.prayerPoints}
                                    handleChange={handlePrayerPointChange}
                                    placeholder="Type prayer points"
                                />
                                {errors.prayerPoints && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.prayerPoints}
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
                    <div className='row p-4 border-top'>
                        <div className="col-md-12 d-flex justify-content-end">
                            <CloseButton 
                                close={props.close}
                            />
                        </div>
                        <div className="col-md-5 d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <PageTitle text={`Review daily prayer (Day ${formData.day})`} />
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
                                <h5 className="m-0 name">{formData?.header}</h5>
                                <span className="small text-muted mt-4">Subtitle: {formData?.subtitle}</span>
                            </div> 
                        </div>
                        

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Scriptures</h5>
                                    
                                    <GetBiblePassage
                                        biblePassage={formData?.scripture}
                                        updatePassageText={upDateBibleVerseText}
                                        index={null}
                                    />
                            </div> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Supporting verses</h5>
                                    {formData?.supportingVerse.map((verse:string, i:number) => {
                                        return(
                                            <>
                                                <GetBiblePassage
                                                    biblePassage={verse}
                                                    updatePassageText={updateSupportVerseText }
                                                    index={i}
                                                />
                                            </>
                                        )
                                    })}
                               
                            </div> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Content/Message</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.content || 'N/A' }}       
                            /> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Prayer points</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.prayerPoints || 'N/A' }}       
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
export default EditDailyPrayer;
