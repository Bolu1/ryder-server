

import UserCard from 'components/UserCard';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import InviteAdmin from './InviteAdmin';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_ADMINS, GET_ALL_ROLES } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, extractErrorMessage, processAlertError, processAlertSuccess } from 'utils';
import Filter from 'components/Filter';
import CircularLoader from 'utilComponents/Loader';
import { ACTIVATE_ADMIN, DEACTIVATE_ADMIN } from 'GraphQl/Mutations';
import ViewSingleMember from './ViewSingleAdmin';
import userIcon from 'assets/images/user.png';
import SearchInput from 'utilComponents/SearchInput';

const AdministratorsList = ():JSX.Element => {
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
        alertMessage:{},
        dataArr:[],
        rolesArr: [],
        isLoading:true,
        viewSingle: false,
        userId: null,
        search: "",
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, isLoading, alertMessage, dataArr, rolesArr, viewSingle, userId, search, pagination} = state;
    const { fetchMore } = useQuery(GET_ALL_ADMINS, {
        variables: {
            page: 0,
            limit: 10,
            query: search,
        },
    });
    const rolesRequest = useQuery(GET_ALL_ROLES, {
        variables: {
            page: 0,
            limit: 10000,
        },
    });
    const [activateAdmin] = useMutation(ACTIVATE_ADMIN);
    const [deactivateAdmin] = useMutation(DEACTIVATE_ADMIN);

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
    const fetchData =  async (paginationArgs = pagination) => {
        try {
             
            const searchItem = search?? ' ';
            const apiData : any = 
                    await fetchMore({
                        variables:{
                            query: searchItem,
                            page: paginationArgs?.page + 1,
                            limit: paginationArgs?.rowsPerPage 
                        }
                    });
            const {data, loading, error} = apiData;
            if(data){
                setState({
                    dataArr: data?.getAllAdmin?.docs,
                    pagination:{
                        rowsPerPage: apiData?.data?.getAllAdmin?.limit,
                        page: apiData?.data?.getAllAdmin?.page - 1,
                        totalRecords: apiData?.data?.getAllAdmin?.totalDocs,
                    },
                });
            };
            if(!loading){
                setState({
                    isLoading: false,
                });
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                });
            };
        } catch (error) {
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
                isLoading: false,
            });
        }
    };
    const fetchRoles =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = await rolesRequest?.fetchMore({
            variables:{
                page: 0,
                limit: 10000
            }
        });
       
         if(apiData.data){
            setState({
                rolesArr: apiData?.data?.getRoles?.docs,
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage : processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };
    useEffect(() => {
        fetchData();
        fetchRoles();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const deactivateAdministrator = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will deactivate the selected admin account, click ok to continue")){
            await deactivateAdmin({variables:{adminID: id}});
            setState({
                alertMessage :processAlertSuccess('Admin account deactivated'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const activateAdministrator = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will activate the selected admin account, click ok to continue")){
            await activateAdmin({variables:{adminID: id}});
            setState({
                alertMessage :processAlertSuccess('Admin account activated'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const viewUserProfile = (id:any) => {
        setState({
            viewSingle: !viewSingle,
            userId: id,
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
       
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        <div className="bg-white">
        {!viewSingle? (
            <>
                <div className="row  pt-4 px-4 justify-content-end">
                    <div className='col-md-5 mb-4 mt-3'>
                        <SearchInput  handleSearchData={handleSearchData} fetchData={fetchData} value={search}/>
                    </div>
                </div>

                {isLoading ? (
                    <>
                        <CircularLoader />
                    </>
                ) : (
                    <>
                        <div className="row  py-4 px-4 overflow-y-auto ">
                            {dataArr.map((datum: any, _i: number) => {

                                return (
                                    <>
                                        {datum?.full_name && (
                                            <div className="col-md-6">
                                                <div className="my-2">
                                                    <UserCard
                                                        name={datum?.full_name ?? null}
                                                        role={datum?.role ? capiitalizeFirstLetter(datum?.role?.name) : ''}
                                                        time={'22/03/2022'}
                                                        avatar={datum?.avatar?datum?.avatar : userIcon}
                                                        active={datum?.status}
                                                        id={datum._id}
                                                        disableAccount={deactivateAdministrator}
                                                        activateAccount={activateAdministrator}
                                                        viewProfile={viewUserProfile} />
                                                </div>
                                            </div>
                                        )}

                                    </>
                                );
                            })}

                        </div>

                    </>
                )}
                <Pagination
                    count={pagination?.totalRecords}
                    page={pagination?.page}
                    rowsPerPage={pagination?.rowsPerPage}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage} 
                />
                <div>

                    <InviteAdmin
                        addAlert={addAlert} 
                        roles={rolesArr}
                    />
                </div>
            </>
   
        ):(
            <>
                    <ViewSingleMember
                        userId={userId}
                        close={viewUserProfile}
                        listingReload={fetchData}
                        roles={rolesArr}
                    />
                </>
        )}
        </div>
    </>
    )

};
export default AdministratorsList;

