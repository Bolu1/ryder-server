import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, formatDate, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import { GET_ALL_ADMINS, GET_SINGLE_PRAYER } from 'GraphQl/Queries';
import FormGroupTextarea from 'utilComponents/FormGroupTextarea';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_PRAYER } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import CustomDatePicker from 'utilComponents/DatePicker';
import CircularLoader from 'utilComponents/Loader';
import CloseButton from 'components/CloseButton';

const EditApostlePrayer = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            title: '',
            subtitle: '',
            author: '',
            content:'',
            date: null,

        },
        payload:{},
        errors:{},
        isLoading: true,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, preview, adminData,  bibleVerseData} = state;
    // GraphQL
    const [createNewPrayer, { data, loading, error }] = useMutation(EDIT_PRAYER);
    const adminDataQuery = useQuery(GET_ALL_ADMINS); 
    const prayerQuery = useQuery(GET_SINGLE_PRAYER, {
        variables: { prayerId: props?.prayerId}
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
            'title': 'required',
            'subtitle' : 'required',
            'author': 'required',
            'content':'required',
            'date': 'required',
        };

        const messages = {
            'title.required': 'Enter a title',
            'subtitle.required': 'Subheader is required',
            'author.required': 'Author required',
            'content.required': 'Content required',
            'date.required': 'Select a publish date'
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
                
            };
            delete payload.date;
            await createNewPrayer({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Prayer saved successfully'),
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
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    }

    useEffect(() => {
        
        if(adminDataQuery.data){
            const adminList:any = JSON.parse(JSON.stringify(adminDataQuery.data.getAllAdmin));
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
                alertMessage :processAlertError(extractErrorMessage(adminDataQuery.error)),
            });
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [adminDataQuery.data]);


    useEffect(() => {
        if(prayerQuery.data){
            const{getPrayer} = prayerQuery?.data;
            console.log(getPrayer);
            setState({
                formData:{
                    title: getPrayer?.title,
                    subtitle: getPrayer?.subtitle,
                    author: getPrayer?.author,
                    preface: getPrayer?.preface,
                    date: getPrayer?.publishedAt,
                },
                isLoading: false,
            });
        };
        if(prayerQuery.error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(prayerQuery.error)),
                isLoading: false,
            })
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [prayerQuery.data]);

    return(
        <>
            {!preview && (
                <div className="row justify-content-between align-items-start pt-3">
                <div className="col-md-6">
                    <PageTitle text='Update Prayer' />
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
                {isLoading ? (
                    <>
                        <CircularLoader />
                    </>
                ):(
                    <>
                        {!preview? (
                    <>
                        <div className="row  pt-2">
                            <div className="col-md-12 mb-4">
                                <FormGroupInput
                                    placeholder="Prayer title"
                                    value={formData?.title}
                                    onChange={handleChange}
                                    name="title"
                                    showError={errors.title}
                                    errorMessage={errors.title}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <FormGroupSelect
                                    placeholder="Select author"
                                    label="Select author"
                                    onChange={(e: object)=>handleSelectChange(e, 'author')}
                                    name="author"
                                    showError={errors.author}
                                    errorMessage={errors.author} 
                                    selectOptions={adminData}
                                    defaultValue={{value:formData?.author, label:formData?.author}}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Pick a date (Publish date)</label>
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
                            <div className="col-md-12 mb-4">
                                <FormGroupTextarea
                                    placeholder="Prayer subheading"
                                    value={formData?.subtitle}
                                    onChange={handleChange}
                                    name="subtitle"
                                    showError={errors.subtitle}
                                    errorMessage={errors.subtitle}
                                />
                                
                            </div>
                            
                            <div className="col-md-12 mb-4">
                            <h6 className='mb-2'>Prayer preface</h6>
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.preface}
                                    handleChange={handleEditorChange}
                                    placeholder="Type prayer preface"
                                />
                                {errors.preface && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.preface}
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
                        <div className="col-md-5 d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <PageTitle text='Update prayer' />
                            </div>
                            <div className='username small text-muted'>
                                <li>{formData?.category}</li>
                            </div>
                            <>
                                <Badges
                                    text={'Pending'}
                                    type='pending'
                                />
                            </>
                            
                        </div>
                        <div className='col-md-9'>
                            <img src={missionIcon} />
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">{formData?.title}</h5>
                                <span className="small text-muted mt-4">By {formData?.author}</span>
                            </div> 
                        </div>
                        
                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Prayer subheader</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"    
                            > 
                                {formData?.subtitle}
                            </div>
                        </div>
                       

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Prayer content</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.content || 'N/A' }}       
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
                    </>
                )}
               

                
                
                </div>
            </>
        
        
        </>
    )

};
export default EditApostlePrayer;
