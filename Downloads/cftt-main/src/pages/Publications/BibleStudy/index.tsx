import moment from 'moment';
import React, {useEffect, useReducer} from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import calendarDot from 'assets/images/calendar-dot.svg';
import CreateButton from 'utilComponents/CreateButton';
import CreateBibleStudy from './CreateBibleStudy';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_BIBLE_STUDY_CONTENT } from 'GraphQl/Queries';
import EditBibleStudy from './EditBibleStudy';
import { publishOptions } from 'constants/index';
import AlertComponent from 'components/AlertComponent';
import DeleteModal from 'utilComponents/DeleteModal';
import { DELETE_BIBLE_STUDY, PUBLISH_BIBLE_STUDY, UNPUBLISH_BIBLE_STUDY } from 'GraphQl/Mutations';
import Filter from 'components/Filter';
import CircularLoader from 'utilComponents/Loader';
import Pagination from 'utilComponents/TablePagination';
import SearchInput from 'utilComponents/SearchInput';
import ViewSingleBibleStudy from './ViewSingleBibleStudy';
const BibleStudy =() => {

    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllStudies: true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleStudy: false,
        status: 'null',
        showDeleteModal:false,
        search: ''
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        page, 
        isLoading, 
        rowsPerPage, 
        alertMessage,  
        dataArr,
        activeId,
        showAllStudies,
        showCreateForm,
        showEditForm,
        showViewSingleStudy,
        status,
        showDeleteModal, 
        search
    } = state;
    // GRAPHQL
  
    const { fetchMore } = useQuery(GET_ALL_BIBLE_STUDY_CONTENT, {
        variables: {
          query: search,
          page: 0,
          limit: 10,
          flag:status,
        },
    });

    const [unPublishBibleStudyData] = useMutation(UNPUBLISH_BIBLE_STUDY);
    const [publishBibleStudyData] = useMutation(PUBLISH_BIBLE_STUDY);

    const defaultView = (refresh= null) => {
        setState({
            showAllStudies:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleStudy: false,
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

    const closePages = () => {
        setState({
            showAllStudies: true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleStudy: false,
            activeId:null,
        })
    };

    const changeStatus = (e:any) => {
        const option = changeOptionsToBool(e?.target?.value);
        setState({
            status: option,
        });
        fetchData(option);
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
                dataArr: apiData?.data?.getAllBibleStudyContent?.docs,
                pagination:{
                    rowsPerPage: apiData?.data?.getAllSermons?.limit,
                    page: apiData?.data?.getAllSermons?.page - 1,
                    totalRecords: apiData?.data?.getAllSermons?.totalDocs,
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
    }, [page, rowsPerPage]);

    const unPublishData = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will unpublish this bible study, click ok to continue")){
            await unPublishBibleStudyData({variables:{biibleStudyContentId: id}});
            setState({
                alertMessage :processAlertSuccess('Message unpublished'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const publishData = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will publish this bible study, click ok to continue")){
            await publishBibleStudyData({variables:{biibleStudyContentId: id}});
            setState({
                alertMessage :processAlertSuccess('Message published'),
                isLoading: false,
            });
            fetchData();
        }
    };

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
        {showAllStudies && (
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
                                                        onClick={()=> {
                                                            setState({
                                                                showAllStudies:false,
                                                                showCreateForm: false,
                                                                showEditForm: false,
                                                                showViewSingleStudy: true,
                                                                activeId:datum?._id,
                                                            });
                                                        }}
                                                    >
                                                        
                                                        <h6 className='apostle-desk-post-header d-flex gap-20 align-items-center'>{capiitalizeFirstLetter(datum?.topic)}
                                                            <p className='user-name font-weight-light mb-0'>by {datum?.minister}</p>
                                                        </h6>
                                                        <p 
                                                            className='apostle-desk-post-body'  
                                                            dangerouslySetInnerHTML={{ __html: truncateMultilineText(
                                                                datum?.message, 300) || 'N/A' }}
                                                        />
                                                        
                                                    
                                                    </div>
                                                    <div className='col-md-2 text-right' >
                                                        <div className='d-flex flex-row-reverse mb-3'>
                                                            {datum?.published?(
                                                                <Badges
                                                                    clickEvent={()=>unPublishData(datum?._id)}
                                                                    text="Published"
                                                                    type="success"
                                                                />
                                                            ):(
                                                                <Badges
                                                                    clickEvent={()=>publishData(datum?._id)}
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
                                                                        showAllStudies:false,
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

                   
                </div>

                <div>
    
                    <CreateButton
                        actionEvent={()=> 
                            setState({
                                showAllStudies:false,
                                showCreateForm: true,
                                showEditForm: false,
                                showViewSingleStudy: false,
                                activeId:null,
                            })
                        }
                        text={'Create Bible Study'}
                        float
                    />
                </div>
            </>
        )}
        
        

        {showCreateForm && (
            <div className='px-4 py-3'>
               <CreateBibleStudy
                    close={closePages}
               />
            </div>
        )}

        {showEditForm && (
            <div className='px-4 py-3'>
               <EditBibleStudy
                    close={closePages}
                    bibleStudyId={activeId}
               />
            </div>
        )}

        {showViewSingleStudy && (
            <div className='px-4 py-3'>
                <ViewSingleBibleStudy
                    close={defaultView}
                    bibleStudyId={activeId}
                />
            </div>
        )}

        {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_BIBLE_STUDY}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="bibleStudyContentId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}      
           
            
        </>
    )
};

export default BibleStudy;