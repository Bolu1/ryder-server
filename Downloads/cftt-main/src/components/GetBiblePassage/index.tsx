import { useQuery } from '@apollo/client';
import { GET_BIBLE_FULL_CHAPTER, GET_BIBLE_PASSAGE } from 'GraphQl/Queries';
import React, {useReducer, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, processAlertError, splitBiblePassage } from 'utils';

interface propsObject {
    biblePassage : string;
    index: number| null;
    updatePassageText: Function;
  }
const GetBiblePassage = (props: propsObject):JSX.Element => {
    const initialState = {
        
        alertMessage:{},
        isLoading: true,
    };
   
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading} = state;
    const {biblePassage, updatePassageText, index} = props;
    const checkForMultipleVerse = splitBiblePassage(biblePassage);
    const finalQuery = checkForMultipleVerse?.multipleVerses? GET_BIBLE_FULL_CHAPTER : GET_BIBLE_PASSAGE;
 
    const { data, loading, error } = useQuery(finalQuery, {variables: checkForMultipleVerse});
    useEffect(() => {
        if(data){
            updatePassageText({refrence :biblePassage, text: data?.getBibleBookVerse?.text}, index);
            
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
        
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [data]);

    const renderMultipleVerses = () => {
        const {getBibleBookChapter} = data;
        const verseArray = checkForMultipleVerse.verse.split("-");
        const from = Number(verseArray[0]);
        const to = Number(verseArray[1]);
        let newBookChapters = [...getBibleBookChapter?.verse];
        newBookChapters =  newBookChapters.slice(from - 1, to);
       
        const chapterVerses = newBookChapters?.map((item:any, index:number) => {
            console.log(item);
            return(
                <div className='py-1 small'>
                    <h6 className='mb-1 small font-weight-bold'>Verse {item.num}: </h6>
                    <span className='small'>{item.text}</span>
                </div>
            )
        });

        return chapterVerses;
    };

   
    return(
        <>
            <div className='mt-2'>
                <h6>{biblePassage}</h6>
            </div>
            {!isLoading && (
                <>
                    <div className='text-muted font-italic font-italic font-weight-light mt-1 h6'>
                        {data?.getBibleBookVerse? (
                            <p className=" mt-1 small px-2">{data?.getBibleBookVerse?.text}</p>
                        ): (
                            <>
                                {renderMultipleVerses()}
                            </>
                        )}
                        
                    </div> 
                </>
            )}
            
        </>
    );

};
export default GetBiblePassage;