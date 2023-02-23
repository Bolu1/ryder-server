import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, formatDate, isNotEmptyArray, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_DAILY_BIBLE_READING } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import GetBiblePassage from 'components/GetBiblePassage';
import CloseButton from 'components/CloseButton';
import CustomDatePicker from 'utilComponents/DatePicker';
import BackButton from 'utilComponents/BackButton';

const CreateDailyBibleReading = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            verseOfTheDayText: '',
            bibleText: '',
            date: '',
        },
        verseContent:'',
        payload:{},
        errors:{},
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [createNewDailyBibleReading, { data, loading, error }] = useMutation(CREATE_DAILY_BIBLE_READING); 
    const {formData, isLoading, alertMessage, errors, preview, verseContent} = state;

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
        const newFormData = {...formData};
        const rules = {
            'verseOfTheDayText': 'required',
            'bibleText': 'required',
            'date':'required',
        };

        const messages = {
            'verseOfTheDayText.required': 'Bible verse required',
            'bibleText.required': 'Full bible reference required',
            'date.required': 'Select publish date',
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
                verseContent:verseContent,
            };
            await createNewDailyBibleReading({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Daily bible reading saved successfully'),
            });
            scrollTop();
            setTimeout(function () {
                props.close(true);
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
      
        setState({
            verseContent: bibleVerseObj?.text,
        })
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

    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-start pt-3">
                    <div className="col-md-6">
                        <PageTitle text='Create Daily Bible Reading' />
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
                                    placeholder="Bible verse"
                                    value={formData?.verseOfTheDayText}
                                    onChange={handleChange}
                                    name="verseOfTheDayText"
                                    showError={errors.verseOfTheDayText}
                                    errorMessage={errors.verseOfTheDayText}
                                />
                            </div>

                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Full bible reference"
                                    value={formData?.bibleText}
                                    onChange={handleChange}
                                    name="bibleText"
                                    showError={errors.bibleText}
                                    errorMessage={errors.bibleText}
                                />
                            </div>

                            <div className="col-md-6 mb-4">
                                <CustomDatePicker
                                    value={formData?.date}
                                    //@ts-ignore
                                    onChange={(e:any)=>handleDateChange(e)}
                                    dayPlaceholder='Select'
                                    monthPlaceholder='publish'
                                    yearPlaceholder='date'
                                    showError={errors.date}
                                    errorMessage={errors.date}
                                />
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
                        <div className="col-md-12 d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <PageTitle text='Daily bible reading preview' />
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
                                <h5 className="m-0 name">Verse of the day</h5>
                            </div>
                            
                            <p className="text-dark mt-1 small px-2 font-italic">
                                <GetBiblePassage
                                    biblePassage={formData?.verseOfTheDayText}
                                    updatePassageText={upDateBibleVerseText}
                                    index={null}
                                />
                            </p> 

                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Full bible reference</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"      
                            > 
                                {formData?.bibleText}
                            </div>
                            
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Publish date</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"      
                            > 
                                {formData?.date}
                            </div>
                            
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
export default CreateDailyBibleReading;
