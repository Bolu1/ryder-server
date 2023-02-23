import React, {useReducer, useEffect } from 'react';
import { GET_SINGLE_ADMIN  } from 'GraphQl/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { ACTIVATE_ADMIN, DEACTIVATE_ADMIN } from 'GraphQl/Mutations';
import { extractErrorMessage, formatDate2, processAlertError, processAlertSuccess } from 'utils';
import { ArrowNarrowLeft, EditCircle } from 'tabler-icons-react';
import userIcon from 'assets/images/user.png';
import './viewsingleuser.scss';
import { DivLoader } from 'utilComponents/Loader';
import ChangeAdminRole from '../ChangeAdminRole';

const ViewSingleMember = (props : any) => {
    const {userId, close, listingReload, roles} = props; 

    const initialState = {
        userObject: {
            avatar: "",
            createdAt: "",
            email: "",
            full_name: "",
            phone: "",
            role: "",
            updatedAt: "",
            status:true,
        },
        showChangeRoleModal: false,
        isLoading: true,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const { isLoading, alertMessage, userObject, showChangeRoleModal } = state;
    const { fetchMore }  = useQuery(GET_SINGLE_ADMIN,{variables:{id: userId}});

    const [activateAdmin] = useMutation(ACTIVATE_ADMIN);
    const [deactivateAdmin] = useMutation(DEACTIVATE_ADMIN);

    const fetchData = async() => {
        try {
             
            const apiData : any = await fetchMore({
                variables: { id: userId}
            });
            const {data, loading, error} = apiData;
            if(data){
                setState({
                    userObject: data?.getAdmin,
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

    useEffect(() => {
        fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const userAction = () => {
        if(userObject?.status){
            return deactivateMemberAccount();
        }
        return activateMemberAccount();
    }

    const deactivateMemberAccount = async() => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will deactivate the selected admin account, click ok to continue")){
            await deactivateAdmin({variables:{adminID: userId}});
            setState({
                alertMessage : processAlertSuccess('Admin account deactivated'),
                isLoading: false,
            });
            fetchData();
            listingReload();
        }
    };

    const activateMemberAccount = async () => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will activate the selected admin account, click ok to continue")){
            await activateAdmin({variables:{adminID: userId}});
            setState({
                alertMessage : processAlertSuccess('Admin account activated'),
                isLoading: false,
            });
            fetchData();
            listingReload();
        }
    };
    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const backButton = () => {
        // close();
        return(
            <span className='d-flex align-items-center pointer' onClick={()=>{ close()}}>
                <ArrowNarrowLeft
                    size={30}
                    strokeWidth={2}
                    color={'black'}
                />
                &nbsp;&nbsp;Go back
            </span>
        );
    };
    const toggleChangeRoleModal = (refresh = null) => {
        setState({
            showChangeRoleModal: !showChangeRoleModal,
        })
        if(refresh){
            Promise.all([
                fetchData(),
                listingReload(),
            ]);
            
        }
    };
    return (
        <div className='single-user px-4 py-5'>
            {backButton()}
            {isLoading? (
                <div>
                    <DivLoader />
                </div>
            ): (
                <>
                    <div className='row'>
                    <div className='col-md-12'>
                        <div className='single-member-avatar'>
                            <div className='user-picture'>
                            <img src={userObject?.avatar?userObject?.avatar : userIcon} className="user-profile-img" />
                            </div>
                            <div className='user-info'>
                                <div className='user-fullname'>
                                    {userObject?.full_name}
                                </div>
                                <div className={`user-status d-flex align-items-center ${userObject?.status? 'active': 'suspended'}`}>
                                <div className={`${userObject?.status? 'active-dot': 'suspended-dot'} dot`} /> &nbsp;&nbsp;{userObject?.status? 'Active':'Suspended'}
                                </div>
                                <div className='btn-container'>
                                    <button onClick={()=> userAction()}>
                                       {userObject?.status? 'Suspend': 'Activate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-5'>
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Created
                        </div>
                        <div className='info-text'>
                            {formatDate2(userObject?.createdAt)}
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Last update
                        </div>
                        <div className='info-text'>
                        {formatDate2(userObject?.updatedAt)}
                        </div>
                    </div>
                </div>
                <div className='row mt-5'>
                    <div className='info-label font-weight-bold'>
                        USER DETAILS
                    </div>
                </div>
                <div className='row mt-2'>
                    <div className='col-md-4'>
                        <div className='d-flex align-items-center'>
                            <div className='info-label mb-0'>Role</div>  
                            <div
                                className={` pointer small-edit-button mx-3`}  
                                onClick={()=>{toggleChangeRoleModal()}}
                            >   
                                <EditCircle
                                    className="button-icon"
                                    size={16}
                                    strokeWidth={1.3}
                                    color={'#FFF'}
                                />
                            </div>
                        </div>
                        <div className='info-text'>
                            {userObject?.role?.name}
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Phone
                        </div>
                        <div className='info-text'>
                            {userObject?.phone}
                        </div>
                    </div>
                    
                </div>
                <div className='row mt-3'>
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Email
                        </div>
                        <div className='info-text'>
                            {userObject?.email}
                        </div>
                    </div>
                    
                </div>
                </>
            )}
            {showChangeRoleModal && (
                <ChangeAdminRole
                    rolesArr={roles}
                    userId= {userId}
                    show={showChangeRoleModal}
                    toggleModal={toggleChangeRoleModal}
                    addAlert={addAlert}
                />
            )}
        </div>
    )
};

export default ViewSingleMember;