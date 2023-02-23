import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateButton from 'utilComponents/CreateButton';
import CircularLoader from 'utilComponents/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PRAYERS } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import CreateApostlePrayer from './CreatePrayer';
import EditApostlePrayer from './EditPrayer';
import ViewApostlePrayer from './ViewPrayer';
import Filter from 'components/Filter';
import { publishOptions } from 'constants/index';
import Pagination from 'utilComponents/TablePagination';
import { PUBLISH_PRAYER, UNPUBLISH_PRAYER, DELETE_PRAYER } from 'GraphQl/Mutations';
import DeleteModal from 'utilComponents/DeleteModal';
import SearchInput from 'utilComponents/SearchInput';
import AlertComponent from 'components/AlertComponent';

const Prayers = () => {
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
        showAllPrayers:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSinglePrayer: false,
        status: 'null',
        showDeleteModal:false,
        search: ''
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        search, 
        isLoading,
        alertMessage,  
        dataArr,
        activeId,
        showAllPrayers,
        showCreateForm,
        showEditForm,
        showViewSinglePrayer,
        status,
        showDeleteModal, 
        pagination,
    } = state;
    const { fetchMore } = useQuery(GET_ALL_PRAYERS,{
        variables: {
          query: search,
          page: 0,
          limit: 10,
          flag: status,
        },
    });

    const [unPublishPrayerData] = useMutation(UNPUBLISH_PRAYER);
    const [publishPrayerData] = useMutation(PUBLISH_PRAYER);

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
                        flag:flag,
                        page: paginationArgs?.page + 1,
                        limit: paginationArgs?.rowsPerPage,
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllPrayers?.docs,
                pagination:{
                    rowsPerPage: apiData?.data?.getAllPrayers?.limit,
                    page: apiData?.data?.getAllPrayers?.page - 1,
                    totalRecords: apiData?.data?.getAllPrayers?.totalDocs,
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

    const defaultView = (refresh= null) => {
        setState({
            showAllPrayers:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSinglePrayer: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

    const unPublishData = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will unpublish this prayer, click ok to continue")){
            const unpublish = await unPublishPrayerData({variables:{prayerId: id}});
            setState({
                alertMessage :processAlertSuccess('Prayer unpublished'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const publishData = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will publish this prayer, click ok to continue")){
            const publish = await publishPrayerData({variables:{prayerId: id}});
            setState({
                alertMessage :processAlertSuccess('Prayer published'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const toggleDeleteModal = () => {
        setState({
            showDeleteModal: !showDeleteModal,
        });
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

    const handleSearchData = (searchVal= '') => {
        setState({
            ...state,
            search: searchVal,
        });
    };

    return(
        <>
            {showAllPrayers &&(
                <>
                    <div className="row  py-0 justify-content-between"> 
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
                        {alertMessage?.text && (
                                <div className='col-md-12 d-flex justify-content-end my-2'>
                                <AlertComponent
                                    text={alertMessage.text}
                                    type={alertMessage.type}
                                    onClose={handleAlertClose}
                                />
                            </div>
                        )}
                    {isLoading? (
                        <>
                            <CircularLoader />
                        </>
                    ):(
                        <>
                        {dataArr.map((datum: any, _i:number) => {
                            return(
                                <>
                                    <div className="col-md-12 border-top border-bottom py-3">
                                        <div className='d-flex row align-items-start'>
                                            
                                            <div 
                                                className='col-md-10 pointer'
                                                onClick={()=>{
                                                    setState({
                                                        showAllPrayers:false,
                                                        showCreateForm: false,
                                                        showEditForm: false,
                                                        showViewSinglePrayer: true,
                                                        activeId:datum?._id,
                                                    });
                                                }}
                                            >
                                                <h6 className='apostle-desk-post-header'>{capiitalizeFirstLetter(datum?.title)}</h6>
                                                <p 
                                                    className='apostle-desk-post-body'  
                                                    dangerouslySetInnerHTML={{ __html: truncateMultilineText(datum?.subtitle, 300) || 'N/A' }}
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
                                                                showAllPrayers:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSinglePrayer: false,
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

                                </>
                            )
                        })}
                        </>
                    )}

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
                        
                    </div>
                    <CreateButton
                        actionEvent={()=> {
                            setState({
                                showAllPrayers: false,
                                showCreateForm: true,
                                showEditForm: false,
                                showViewSinglePrayer: false,
                                activeId: null,
                            });
                        } }
                        text={'Create Prayer'}
                        float
                    />
            </>
            )}
            {showCreateForm && (
                <CreateApostlePrayer
                    close={defaultView}
                />
            )}
            {showEditForm && (
                <EditApostlePrayer
                    close={defaultView}
                    prayerId={activeId}
                />
            )}
            {showViewSinglePrayer && (
                <ViewApostlePrayer
                    close={defaultView}
                    prayerId={activeId}
                />
            )}

            {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_PRAYER}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="prayerId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}
        </>
    )
};

export default Prayers;
