import moment from 'moment';
import React, {useReducer, useEffect} from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import Filter from 'components/Filter';
import CreateSermon from './CreateSermon';
import EditSermon from './EditSermon';
import ViewSermon from './ViewSermon';
import Pagination from 'utilComponents/TablePagination';
import  { DivLoader } from 'utilComponents/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_SERMONS } from 'GraphQl/Queries';
import CreateButton from 'utilComponents/CreateButton';
import { DELETE_SERMON, PUBLISH_SERMON, UNPUBLISH_SERMON } from 'GraphQl/Mutations';
import { publishOptions } from 'constants/index';
import AlertComponent from 'components/AlertComponent';
import DeleteModal from 'utilComponents/DeleteModal';
import SearchInput from 'utilComponents/SearchInput';

const Sermons =() => {
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllSermons:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleSermon: false,
        status: 'null',
        showDeleteModal:false,
        search: ''
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        isLoading,
        alertMessage,  
        showDeleteModal, 
        dataArr,
        activeId,
        showAllSermons,
        showCreateForm,
        showEditForm,
        showViewSingleSermon,
        status,
        pagination,
        search
    } = state;
    const { fetchMore } = useQuery(GET_ALL_SERMONS, {
        variables: {
          query: search,
          page: 0,
          limit: 10,
          flag:status,
        },
    });

    const [unPublishSermonData] = useMutation(UNPUBLISH_SERMON);
    const [publishSermonData] = useMutation(PUBLISH_SERMON);

    const defaultView = (refresh= null) => {
        setState({
            showAllSermons:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleSermon: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        const newPagination = {
            ...pagination,
            page: newPage,
        };
        setState({
            page: newPage,
        });
        fetchData(status, newPagination);
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        
        const newPagination = {
            ...pagination,
            rowsPerPage: event?.target?.value,
        };
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData(status, newPagination);
    };

    const fetchData =  async (flag= status, paginationArgs = pagination) => {
        setState({
            isLoading:true,
        });
        const searchItem = search?? ' ';
        const apiData : any = 
        await fetchMore({
                    variables:{
                        query: searchItem,
                        page: paginationArgs?.page + 1,
                        limit: paginationArgs?.rowsPerPage,
                        flag: flag,
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllSermons?.docs,
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

    const changeStatus = (e:any) => {
        const option = changeOptionsToBool(e?.target?.value);
        setState({
            status: option,
        });
        fetchData(option, pagination);
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

    const unPublishData = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will unpublish this sermon, click ok to continue")){
            await unPublishSermonData({variables:{sermonId: id}});
            setState({
                alertMessage :processAlertSuccess('Sermon unpublished'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const publishData = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will publish this sermon, click ok to continue")){
            await publishSermonData({variables:{sermonId: id}});
            setState({
                alertMessage :processAlertSuccess('Sermon published'),
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
            {showAllSermons &&( 
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
                                <DivLoader />
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
                                    <div className="col-md-12 border-top py-3">
                                        <div className='d-flex row align-items-start'>
                                            <div className='col-md-2'>
                                                <div className='banner-container'>
                                                    {datum?.image? (
                                                        <img 
                                                        className='img-fluid pointer w-100'
                                                        src={datum?.image} 
                                                        alt="Message banner"
                                                    />
                                                    ):(
                                                        <img 
                                                        className='img-fluid pointer w-100'
                                                        src='https://thumbs.dreamstime.com/z/smile-god-love-you-text-wood-cycle-face-40762828.jpg' 
                                                        alt="Message banner"
                                                    />
                                                    )}
                                                </div>
                                            </div>
                                            <div 
                                                className='col-md-8 pointer'
                                                onClick={()=> {
                                                    setState({
                                                        showAllSermons:false,
                                                        showCreateForm: false,
                                                        showEditForm: false,
                                                        showViewSingleSermon: true,
                                                        activeId:datum?._id,
                                                    });
                                                }}
                                            >
                                                <h6 className='apostle-desk-post-header'>{capiitalizeFirstLetter(datum?.title)}</h6>
                                                <p 
                                                    className='apostle-desk-post-body'  
                                                    dangerouslySetInnerHTML={{ __html: truncateMultilineText(
                                                        datum?.message, 300) || 'N/A' }}
                                                />
                                                
                                            
                                            </div>
                                            <div className='col-md-2 text-right' >
                                                <div className='d-flex flex-row-reverse'>
                                                    
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
                                                <div className='d-flex flex-row-reverse published-time-posted mt-3'>
                                                {moment(new Date()).format("DD/MM/YYYY, hh:mm:ss")}
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
                                                                showAllSermons:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSingleSermon: false,
                                                                activeId:datum?._id,
                                                            });
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
                                
                                )}
                            )}
                        </>
                    
                    )}
                    
                    </div>

                    <div>
                        <CreateButton
                            actionEvent={()=> 
                                setState({
                                    showAllSermons: false,
                                    showCreateForm: true,
                                    showEditForm: false,
                                    showViewSingleSermon: false,
                                    activeId: null,
                                })
                            }
                            text={'Create Sermon'}
                            float
                        />
                    </div>

                    {dataArr.length !== 0 && (
                            <>
                                <div>
                                    <Pagination
                                        count={pagination?.totalRecords}
                                        page={pagination?.page}
                                        rowsPerPage={pagination?.rowsPerPage}
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
                    <CreateSermon
                        close={defaultView}
                    />
                </div>
            )}

            {showEditForm && (
                <div className='px-4'>
                    <EditSermon
                        close={defaultView}
                        messageId={activeId}
                    />
                </div>
            )}  
            {showViewSingleSermon && (
                <div className="px-4">
                    <ViewSermon
                        close={defaultView}
                        messageId={activeId}
                    />
                </div>
            )}

            {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_SERMON}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="sermonId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}
        </>
    )
};

export default Sermons;