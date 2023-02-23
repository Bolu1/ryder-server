import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, formatDate, isNotEmptyArray, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import { GET_ALL_ADMINS } from 'GraphQl/Queries';
import FormGroupTextarea from 'utilComponents/FormGroupTextarea';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRAYER } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import CustomDatePicker from 'utilComponents/DatePicker';
import moment from 'moment';
import CloseButton from 'components/CloseButton';
import BackButton from 'utilComponents/BackButton';

const CreateApostlePrayer = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            title: '',
            subtitle: '',
            author: '',
            preface:'',
            date:null,
        },
        payload:{},
        errors:{},
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, preview, adminData,  bibleVerseData} = state;
    // GraphQL
    const [createNewPrayer, { data, loading, error }] = useMutation(CREATE_PRAYER);
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

    const handleEditorChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                preface: data,
            },
            errors:{
                ...state.errors,
                preface: '',
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
            'preface': 'required',
            'date': 'required',
        };

        const messages = {
            'title.required': 'Enter a title',
            'subtitle.required': 'Subheader is required',
            'author.required': 'Author required',
            'preface.required': 'Preface required',
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
                date: formData.date,
            };
           
            await createNewPrayer({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Prayer saved successfully'),
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
                <div className="row justify-content-between align-items-start pt-3">
                    <div className="col-md-6">
                        <PageTitle text='Create Prayer' />
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
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Pick a date (Publish date)</label>
                                <CustomDatePicker
                                    value={formData?.date}
                                    //@ts-ignore
                                    onChange={(e:any)=>handleDateChange(e)}
                                    placeholder="Select publish date"
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
                            <h6 className='mb-2'>Type prayer preface</h6>
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
                    <div className='row p-2'>
                        <div className='col-md-12 px-0'>
                            <BackButton close={()=> setState({preview : !preview})} />
                        </div>
                        <div className="col-md-5 d-flex justify-content-between align-items-start mb-4 mt-3">
                            <div>
                                <PageTitle text='Prayer review' />
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
                                <h5 className="m-0 name">Prayer preface</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.preface || 'N/A' }}       
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
export default CreateApostlePrayer;
