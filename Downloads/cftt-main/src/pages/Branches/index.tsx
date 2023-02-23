import PageTitle from 'components/PageTitle';
import { EditCircle } from 'tabler-icons-react';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import Filter from 'components/Filter';
import branchIcon from 'assets/images/branch.png';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import CreateBranch from './CreateBranch';
import EditBranch from './EditBranch';
import MakeSelection from 'utilComponents/MakeSelectionIcon';
import SearchInput from 'utilComponents/SearchInput';
import { extractErrorMessage, formatDate2, formatInitialDateValue, processAlertError } from 'utils';
import CircularLoader from 'utilComponents/Loader';
import Badges from 'utilComponents/Badges';
import { useQuery } from '@apollo/client';
import { GET_ALL_BRANCHES } from 'GraphQl/Queries';
import ViewBranch from './ViewBranch';


const Branches = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeDataObj:{},
        showEditModal: false,
        isLoading: true,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
        search: ''
    };
   
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {
        listView, 
        page, 
        isLoading, 
        activeDataObj, 
        alertMessage,  
        showEditModal, 
        dataArr,
        pagination,
        search
    } = state;

    const { fetchMore } = useQuery(GET_ALL_BRANCHES, {
        variables: {
          query: search,
          page: 1,
          limit: 10,
        },
    });
    
    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        const newPagination = {
            ...pagination,
            page: newPage,
        };
        setState({
            page: newPage,
        });
        fetchData(newPagination);
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        const newPagination = {
            ...pagination,
            rowsPerPage: event?.target?.value,
        };
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData(newPagination);
        
    };
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData = async (paginationArgs = pagination) => {
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
                        
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllBranch?.docs,
                activeDataObj: apiData?.data?.getAllBranch?.docs? apiData?.data?.getAllBranch?.docs[0] : {},
                pagination:{
                    rowsPerPage: apiData?.data?.getAllBranch?.limit,
                    page: apiData?.data?.getAllBranch?.page - 1,
                    totalRecords: apiData?.data?.getAllBranch?.totalDocs,
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


    const toggleEditModal = () => {
        setState({
            showEditModal: !showEditModal,
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
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Branches' />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
            <TableListView
                isActive={listView}
                actionEvent={changeListView}
            />
        </div>
        </div>
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        {isLoading? (
            <>
            
                <CircularLoader/>
            </>
        ):(
            <>
        <div className="bg-white">
        <div className="row ">
            <div className="col-md-4 list-column border-right pr-0">
                <div className="p-3">
                <div className=' mb-4 mt-3'>
                    <SearchInput  handleSearchData={handleSearchData} fetchData={fetchData} value ={search} />
                </div>
                    
                </div>
                {dataArr?.map((datum:any,_i:number) =>{
                    return(
                        <>
                            <div 
                                className={`
                                    d-flex pointer justify-content-between 
                                    align-items-start px-3 py-2 border-top border-bottom 
                                    ${activeDataObj?._id === datum?._id? 'active-list':''}`
                                }
                                onClick={()=> setState({...state, activeDataObj: datum})}
                            >
                
                                <div className="user-account pb-2 d-flex align-items-center pr-3">
                                    <div className="avatar">
                                        
                                        <img src={branchIcon} />
                                    </div>
                                    <div className="user-name px-2">
                                        <h6 className="m-0 name">{datum?.name}</h6>
                                        <span className="small email">{formatDate2(new Date(datum?.createdAt))}</span>
                                    </div>
                                </div>
                                <div className="justify-content-end py-0 my-0 pt-1 ">
                                    <Badges
                                        type="success"
                                        text="Active"
                                    />
                                   
                                </div>
                                
                            </div>
                        </>
                    )
                })}
                
                <div>
                    <Pagination
                        count={pagination?.totalRecords}
                        page={pagination?.page}
                        rowsPerPage={pagination?.rowsPerPage}
                        onPageChange={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>

            </div>
            <div className="col-md-8 pl-0">
                {activeDataObj?._id? (
                    <>
                    <div className="d-flex justify-content-between align-items-center border-bottom w-100">
                        <div className=" py-3 px-3">
                        <div className="user-account pb-1 d-flex align-items-center">
                            <div className="avatar">
                                
                                <img src={branchIcon} />
                            </div>
                            <div className="user-name px-2">
                                <h6 className="m-0 name">{activeDataObj?.name}&nbsp;&nbsp;<span className="small font-weight-light text-success">active</span> </h6>
                                <span className="small email">{formatInitialDateValue(activeDataObj?.createdAt)}</span>
                            </div>
                        </div>
                        </div>
                        <div className="px-3">
                            <div className="view-component-right-header m-0 p-0">
                                100,000
                            </div>
                            <div className="user-name">
                                <span className="small email">Branch members</span>
                            </div>
                            
                        </div>
                </div>
                <div className="pt-2 pb-4 px-3 mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-2 w-100">
                            <div className="user-account  d-flex align-items-center">
                                <div className="avatar">
                                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" />
                                </div>
                                <div className="user-name px-2">
                                    <h6 className="m-0 name">{activeDataObj?.branch_president}</h6>
                                    <span className="small email">Branch president</span>
                                </div>
                            </div>
                            <div className="">
                                
                                <div className="user-name">
                                    <span className="small email pointer text-primary">View profile</span>
                                </div>
                                
                            </div>
                    </div>
                    <div className="record-info-header">
                        BRANCH DETAILS 
                            <EditBranch 
                                branch={activeDataObj}
                                addAlert={addAlert}
                            />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="ADDRESS"
                            text="32a Charlseton Close, off Priya Road"
                        />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="BRANCH HEAD"
                            text={activeDataObj?.branch_president}
                        />
                    </div>

                    <ViewBranch
                        branch={activeDataObj}
                    />
                </div>
                    </>
                ):(
                    <div className="mt-5 mb-3">
                        <MakeSelection />
                    </div>
                )}
                
            </div>
        </div>
        </div>
        
            
        <div>
           
            <CreateBranch
                refresh={fetchData}
                addAlert={addAlert}
            />
            {/* {showEditModal && (
                <EditBranch 
                    branch={activeDataObj}
                    show={showEditModal}
                    toggleModal={toggleEditModal}
                />
            )} */}
                
        </div>
        </>
           )}
        </>
    )

};
export default Branches;