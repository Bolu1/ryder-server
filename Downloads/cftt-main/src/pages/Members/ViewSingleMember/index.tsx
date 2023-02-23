import React, {useReducer, useEffect } from 'react';
import { GET_SINGLE_MEMBER } from 'GraphQl/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { ACTIVATE_USER, DEACTIVATE_USER } from 'GraphQl/Mutations';
import { extractErrorMessage, formatDate2, processAlertError, processAlertSuccess } from 'utils';
import { ArrowNarrowLeft } from 'tabler-icons-react';
import userIcon from 'assets/images/user.png';
import './viewsingleuser.scss';
import { DivLoader } from 'utilComponents/Loader';

const ViewSingleMember = (props : any) => {
    const {userId, close, listingReload} = props;
    const initialState = {
        userObject: {
            avartar: "",
            branch: "",
            church_group: [],
            country: "",
            createdAt: "",
            email: "",
            full_name: "",
            phone: "",
            updatedAt: "",
            status:true,
        },
        isLoading: true,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const { isLoading, alertMessage, userObject} = state;
    const { fetchMore }  = useQuery(GET_SINGLE_MEMBER,{variables:{userID: userId}});

    const [activateMember] = useMutation(ACTIVATE_USER);
    const [deactivateMember] = useMutation(DEACTIVATE_USER);

    const fetchData = async() => {
        try {
             
            const apiData : any = await fetchMore({
                variables: { userID: userId}
            });
            const {data, loading, error} = apiData;
            if(data){
                setState({
                    userObject: data?.getUser,
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
        if(confirm("This action will deactivate the selected user account, click ok to continue")){
            await deactivateMember({variables:{userID: userId}});
            setState({
                alertMessage : processAlertSuccess('User account deactivated'),
                isLoading: false,
            });
            fetchData();
            listingReload();
        }
    };

    const activateMemberAccount = async () => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will activate the selected user account, click ok to continue")){
            await activateMember({variables:{userID: userId}});
            setState({
                alertMessage : processAlertSuccess('User account activated'),
                isLoading: false,
            });
            fetchData();
            listingReload();
        }
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
    }
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
                            <img src={userObject?.avartar?userObject?.avartar : userIcon} className="user-profile-img" />
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
                        <div className='info-label'>
                            Phone
                        </div>
                        <div className='info-text'>
                            {userObject?.phone}
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Branch
                        </div>
                        <div className='info-text'>
                            {userObject?.branch}
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
                    <div className='col-md-4'>
                        <div className='info-label'>
                            Country
                        </div>
                        <div className='info-text'>
                            {userObject?.country}
                        </div>
                    </div>
                    <div className='col-md-12 mt-3'>
                        <div className='info-label'>
                            Church group(s)
                        </div>
                        <div className='info-text'>
                            {userObject?.church_group?.join(', ')}
                        </div>
                    </div>
                </div>
                </>
            )}
            
        </div>
    )
};

export default ViewSingleMember;