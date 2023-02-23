import React, {useReducer, useEffect } from 'react';
import { extractErrorMessage, processAlertError, scrollTop, capiitalizeFirstLetter } from 'utils';
import AlertComponent from 'components/AlertComponent';
import PageTitle from 'components/PageTitle';
import { useQuery } from '@apollo/client';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';
import { GET_SINGLE_BIBLE_STUDY_CONTENT, GET_SINGLE_SERMON } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';
import { EditCircle } from 'tabler-icons-react';
import CloseButton from 'components/CloseButton';

const ViewSingleBibleStudy = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            title: '',
            message: '',
            minister: '',
            bibleReading:[],
            category:'',
        },
        payload:{},
        prayers:[''],
        bibleVerseData:[],
        isLoading: false,
        alertMessage:{},
        preview: false,
        showImageModal:false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage,  preview, showImageModal, bibleVerseData} = state;
    const { fetchMore } = useQuery(GET_SINGLE_BIBLE_STUDY_CONTENT, {
        variables: { bibleStudyContentId: props?.bibleStudyId}
    }); 
    
    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    };

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
    
        const apiData : any = await fetchMore({ variables: { bibleStudyContentId: props?.bibleStudyId} });

         if(apiData.data){
            const response = apiData?.data?.getBibleStudyContent;
            
            setState({
                formData:{
                    topic: response?.topic,
                    message: response?.message,
                    minister: response?.minister,
                    bibleReading: [response?.memoryVerse?.refrence],
                },
               
            }); 
          
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const toggleUploadImageModal = () => {
        setState({
            showImageModal: !showImageModal,
        });
    };
    
    const addAlert = (alert:any) => {
        setState({
            alertMessage: alert,
        });
    };

    return(
        <>
            {!preview && (
                <div className="row justify-content-between align-items-start pt-4 px-4">
                <div className="col-md-6">
                    <PageTitle text='View bible study' />
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
                <div className='p-0'>
                {isLoading? (
                    <>
                        <DivLoader />
                    </>
                ):(
                    <>
                        
                        <div className='row p-4'>
                           
                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name h6">{formData?.topic}</h5>
                                    <span className="small text-muted mt-4">By {formData?.minister}</span>
                                </div> 
                            </div>
                            

                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name h6">Memory verse</h5>
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
                                    <h5 className="m-0 name h6">Message</h5>
                                </div>
                                <div 
                                    className="text-dark mt-1 small px-2"
                                    dangerouslySetInnerHTML={{ __html: formData?.message || 'N/A' }}       
                                /> 
                            </div>

                        </div>
                        
                    </>
                )}
                    
                </div>
            </>
            
        </>
    )

};
export default ViewSingleBibleStudy;
