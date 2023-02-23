import React, {useReducer, useEffect } from 'react';
import { extractErrorMessage, processAlertError, scrollTop, splitBiblePassage } from 'utils';
import AlertComponent from 'components/AlertComponent';
import "@pathofdev/react-tag-input/build/index.css";
import {useQuery } from '@apollo/client';
import { GET_BIBLE_PASSAGE} from 'GraphQl/Queries';
import BibleVersonSelection from './BibleVersonSelection';

const ViewAllBibleReadingComponent = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            verseOfTheDayText: props?.verse,
            bibleText: '',
            passage: props?.content,
        },
        verseContent:'',
        payload:{},
        isLoading: false,
        alertMessage:{},
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {fetchMore} = useQuery(GET_BIBLE_PASSAGE, {variables: {}});
    const {formData, isLoading, alertMessage} = state;
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const getVersionPassage = async(bibleversion: string) => {
        try {
            const payload = splitBiblePassage(props?.verse, bibleversion);
            const response = await fetchMore({variables: payload});
            const { data, error }:any = response;
            if(data){
                const responseData= data?.getBibleBookVerse;
                setState({
                    formData: {
                        ...formData,
                        passage: responseData?.text,
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
    };

    useEffect(() => {
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    return(
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
                <>
                    <div className='d-flex align-items-start _gap-4'>
                    <h6 className='apostle-desk-post-header d-flex pl-3 _gap-4 align-items-center'>Verse of the day
                        <p className='user-name font-weight-light mb-0 font-italic'>:{formData?.verseOfTheDayText}</p>
                    </h6>
                        <div>
                            <BibleVersonSelection 
                                bibleVersions={props?.bibleVersions}
                                setVersion={getVersionPassage}
                            />
                        </div>
                    </div>
                    <p className='apostle-desk-post-body' >
                        {formData?.passage}
                    </p>
                </>
        </>

    )

};
export default ViewAllBibleReadingComponent;
