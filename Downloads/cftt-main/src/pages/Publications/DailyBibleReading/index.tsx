import moment from 'moment';
import React, {useReducer, useEffect} from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import Filter from 'components/Filter';
import Pagination from 'utilComponents/TablePagination';
import CircularLoader from 'utilComponents/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_DAILY_BIBLE_READING, GET_ALL_BIBLE_VERSIONS } from 'GraphQl/Queries';
import CreateButton from 'utilComponents/CreateButton';
import { DELETE_DAILY_BIBLE_READING, } from 'GraphQl/Mutations';
import { publishOptions } from 'constants/index';
import AlertComponent from 'components/AlertComponent';
import DeleteModal from 'utilComponents/DeleteModal';
import CreateDailyBibleReading from './CreateDailyBibleReading';
import calendarDot from 'assets/images/calendar-dot.svg';
import EditDailyBibleReading from './EditDailyBibleReading';
import ViewAllBibleReadingComponent from './ViewAllBibleReadingComponent';
import SearchInput from 'utilComponents/SearchInput';

const DailyBibleReading =() => {
    const initialState = {
        listView: true,
        rowsPerPage: 10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllDailyBibleReading:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleSermon: false,
        status: 'null',
        showDeleteModal:false,
        bibleVersions: [],
        search: ''
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        bibleVersions, 
        page, 
        isLoading, 
        rowsPerPage, 
        alertMessage,  
        showDeleteModal, 
        dataArr,
        activeId,
        showAllDailyBibleReading,
        showCreateForm,
        showEditForm,
        showViewSingleSermon,
        status,
        search
    } = state;
    const { fetchMore } = useQuery(GET_ALL_DAILY_BIBLE_READING, {
        variables: {
          query: search,
          page: 0,
          limit: 10,
          flag:status,
        },
    });
    const getAllBibleVersions = useQuery(GET_ALL_BIBLE_VERSIONS, {
        variables: {}});

    const defaultView = (refresh= null) => {
        setState({
            showAllDailyBibleReading:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleMessage: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        
        setState({
            page: newPage,
        });
        fetchData();
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData();
    };

    const fetchData =  async (flag= status) => {
        setState({
            isLoading:true,
        });
        const searchItem = search?? ' ';
        const apiData : any = 
        await fetchMore({
                    variables:{
                        query: searchItem,
                        page: page? page: 0,
                        limit: rowsPerPage? rowsPerPage : 10,
                        flag: flag,
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllDailyBibleContent,
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

    const getBibleVersions =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any =  await getAllBibleVersions?.fetchMore({ variables:{ }});
         if(apiData.data){
            setState({
                bibleVersions: apiData?.data?.getBibleBookVersions,
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

    const changeStatus = (e:any) => {
        const option = changeOptionsToBool(e?.target?.value);
        setState({
            status: option,
        });
        fetchData(option);
    };


    useEffect(() => {
        fetchData();
        getBibleVersions();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [page, rowsPerPage]);

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alert:any) => {
        setState({
            alertMessage:alert,
        });
    };

    const toggleDeleteModal = () => {
        setState({
            showDeleteModal: !showDeleteModal,
        });
    };
    const handleSearchData = (searchVal= '') => {
        setState({
            ...state,
            search: searchVal,
        });
    };
    return (

        <>
            {showAllDailyBibleReading &&( 
                <>
                    <div className="row  py-3 px-4 justify-content-between"> 
                        <div className='col-md-4 mb-4 mt-3'>
                            <SearchInput  handleSearchData={handleSearchData} fetchData={fetchData} />
                        </div>
                        <div className='col-md-6 d-flex justify-content-end mt-3 mb-4'>
                            <Filter
                                text="Show"
                                selectOptions={publishOptions}
                                changeEvent={changeStatus}
                            />
                        </div>
                        {isLoading? (
                            <div className='bg-white'>
                                <CircularLoader />
                            </div>
                        ) :(
                        <>
                            

                            {alertMessage?.text && (
                                 <div className='col-md-12 d-flex justify-content-end my-2'>
                                    <AlertComponent
                                        text={alertMessage.text}
                                        type={alertMessage.type}
                                        onClose={handleAlertClose}
                                    />
                                </div>
                            )}
                             {dataArr.map((datum: any, _i:number) => {
                                return(
                                    <>
                                        
                                        <div className="col-md-12 border-top border-bottom py-3">
                                                <div className='d-flex row align-items-center'>
                                                    <div className='col-md-2 border-right d-flex gap-20'> 
                                                        <img src={calendarDot} />
                                                        <span className='small font-weight-bold'>
                                                            {moment(datum?.createdAt).format('dddd')},<br/>
                                                            {moment(datum?.createdAt).format('D/M/Y')}
                                                            
                                                        </span>
                                                    </div>
                                                    <div 
                                                        className='col-md-8 pointer border-left'
                                                    >
                                                        
                                                        <ViewAllBibleReadingComponent
                                                            verse={datum?.verseOfTheDayText}
                                                            content={datum?.verseContent}
                                                            default="niv"
                                                            bibleVersions={bibleVersions}
                                                        />
                                                    
                                                    </div>
                                                    <div className='col-md-2 text-right' >
                                                        <div className='d-flex flex-row-reverse mb-3'>
                                                            {datum?.published?(
                                                                <Badges
                                                                    // clickEvent={()=>unPublishData(datum?._id)}
                                                                    text="Published"
                                                                    type="success"
                                                                />
                                                            ):(
                                                                <Badges
                                                                    // clickEvent={()=>publishData(datum?._id)}
                                                                    text="Not Published"
                                                                    type="pending"
                                                                />
                                                            )}
                                                                
                                                        </div>
                                                    

                                                        <div className='d-flex justify-content-end mt-4'>
                                                            
                                                            <ActionButton
                                                                text={
                                                                    <>
                                                                        Edit
                                                                    </>
                                                                }
                                                                className="edit-action mr-3"
                                                                actionEvent={()=> {
                                                                    setState({
                                                                        showAllDailyBibleReading:false,
                                                                        showCreateForm: false,
                                                                        showEditForm: true,
                                                                        showViewSingleStudy: false,
                                                                        activeId: datum?._id,
                                                                    })
                                                                }}
                                                                
                                                            />
                                                            
                                                            <ActionButton
                                                                text={
                                                                    <>
                                                                        Delete
                                                                    </>
                                                                }
                                                                className="edit-action "
                                                                actionEvent={()=> {
                                                                    setState({
                                                                        showDeleteModal:true,
                                                                        activeId:datum?._id,
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                    </>
                                
                            )})}
                        </>
                    
                    )}
                    
                    </div>

                    <div>
                        <CreateButton
                            actionEvent={()=> 
                                setState({
                                    showAllDailyBibleReading: false,
                                    showCreateForm: true,
                                    showEditForm: false,
                                    showViewSingleSermon: false,
                                    activeId: null,
                                })
                            }
                            text={'Create Daily Bible Reading'}
                            float
                        />
                    </div>

                    {dataArr.length !== 0 && (
                            <>
                                <div>
                                    <Pagination
                                        count={dataArr.length?? 0}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        onPageChange={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                    )}
            </>
            )}
            {showCreateForm && (
                <div className='px-4'>
                    <CreateDailyBibleReading
                        close={defaultView}
                    />
                </div>
            )}

            {showEditForm && (
                <div className='px-4'>
                     <EditDailyBibleReading
                        close={defaultView}
                        bibleReadingId={activeId}
                    />
                </div>
            )}  
            {showViewSingleSermon && (
                <div className="px-4">
                    {/* <ViewSermon
                        close={defaultView}
                        messageId={activeId}
                    /> */}
                </div>
            )}

            {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_DAILY_BIBLE_READING}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="biibleReadingContentId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}
        </>
    )
};

export default DailyBibleReading;