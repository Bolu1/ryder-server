import { useQuery } from '@apollo/client';
import { Tooltip } from '@mui/material';
import AlertComponent from 'components/AlertComponent';
import PageTitle from 'components/PageTitle';
import { GET_SINGLE_EVENT } from 'GraphQl/Queries';
import { history } from 'helpers';
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowNarrowLeft, CirclePlus, Edit } from 'tabler-icons-react';
import { DivLoader } from 'utilComponents/Loader';
import { extractErrorMessage, formatDate2, processAlertError } from 'utils';
import AddChildEvent from './AddChildEvent';
import EditChildEvent from './EditChildEvent';

const ViewCalenderEvent = (props :any) => {
    const params = useParams();
    // @ts-ignore
    const { id } = params;
    const initialState ={
        alertMessage:{},
        data:{},
        dayObject:{},
        daydifference: null,
        showCreateModal: false,
        showEditModal: false,
        activeEvent: null,
        pageLoading: true,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {data, alertMessage, showCreateModal, showEditModal, daydifference, dayObject, activeEvent, pageLoading } = state;
    const { fetchMore } = useQuery(GET_SINGLE_EVENT, {
        variables: {eventID : id},
    });
    
    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({variables:{eventID : id}});
         if(apiData.data){
            const date1 = new Date(apiData?.data?.getEvent?.startDate);
            const date2 = new Date(apiData?.data?.getEvent?.endDate);
            // @ts-ignore
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const occupiedDays:any = {};
            const childEvent = apiData?.data?.getEvent?.childEvents;
            for (let index = 0; index < childEvent.length; index++) {
                const element = childEvent[index];
                occupiedDays[element?.day] = true;
            };
            setState({
                data: apiData?.data?.getEvent,
                daydifference: diffDays + 1,
                dayObject: occupiedDays,
                isLoading: false,
                pageLoading: false,
                activeEvent: apiData?.data?.getEvent?.childEvents[0]? apiData?.data?.getEvent?.childEvents[0] : null,
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
                pageLoading: false
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
                pageLoading: false
            });
        }
    };

    const toogleCreateModal = () => {
        setState({
            showCreateModal: !showCreateModal
        })
    };

    const toogleEditModal = () => {
        setState({
            showEditModal: !showEditModal
        })
    };

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };
    const refresh = (refresh = null) => {
        setState({
            showCreateModal: false,
            showDeleteModal: false,
            showEditModal: false
        });
        if(refresh){
            fetchData();
        }
    }

    const backButton = () => {
        // close();
        return(
            <span className='d-flex align-items-center pointer' onClick={()=>{ history.push('/calendar')}}>
                <ArrowNarrowLeft
                    size={30}
                    strokeWidth={2}
                    color={'black'}
                />
                &nbsp;&nbsp;Go back
            </span>
        );
    }

    useEffect(() => {
        fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
    return(
        <>
            <div className="row justify-content-between align-items-end">
                <div className="col-md-6">
                    <PageTitle text='View Event' />
                </div>
                <div className='col-md-12 mb-2'>
                    {backButton()}
                </div>
        
            </div>
            {pageLoading?(
                <>
                    <DivLoader />
                </>
            ):(
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
                    <div className="calendar-module bg-white">
                        <div className="row  py-3 px-2">
                            <div className=' col-md-12 py-2'>
                                <h6> Event Details</h6>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    Event name
                                </div>
                                <div className='info-text'>
                                    {data?.eventName}
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    Start date 
                                </div>
                                <div className='info-text'>
                                    {formatDate2(data?.startDate)}
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    End date 
                                </div>
                                <div className='info-text'>
                                    {formatDate2(data?.endDate)}
                                </div>
                            </div>

                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    Time
                                </div>
                                <div className='info-text'>
                                    {formatDate2(data?.time)}
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    Repeat
                                </div>
                                <div className='info-text'>
                                    {data?.repeat? data?.repeat : 'N/A'}
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='info-label'>
                                    Created
                                </div>
                                <div className='info-text'>
                                    {formatDate2(data?.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div className='row p-3'>
                            <div className='col-md-12'>
                                {/* Child events */}
                                <div className="user-name  w-100 mt-4 mb-3 d-flex align-items-center gap-30">
                                            <h5 className="m-0 name h6 ">Add&nbsp;Child&nbsp;Event</h5>
                                            <div className="col-md-12 p-0 d-flex justify-content-start">
                                                <Tooltip title="Add child event" placement="right-start" arrow>
                                                    <span 
                                                        className={` pointer edit-button`}  
                                                        onClick={()=>{
                                                            setState({
                                                                showCreateModal:true,
                                                            })
                                                        }}
                                                    >   
                                                        
                                                        <CirclePlus
                                                            className="button-icon"
                                                            size={20}
                                                            strokeWidth={1.5}
                                                            color={'#FFF'}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </div>
                            </div>
                            <div className='col-md-12 daily-prayer-box-container'>  
                                {data?.childEvents.map((event:any, index:any) => {
                                    return(
                                        <>
                                            <Tooltip title={`Day ${event.day}`} placement="right-start" arrow>
                                                <div 
                                                    className={`daily-prayer-box small pointer ${event?._id === activeEvent?._id? 'active' :''}`}
                                                    onClick={() =>{
                                                            setState({
                                                                activeEvent : event,
                                                            })
                                                    }}
                                                >
                                                    <div>
                                                        {event?.day}
                                                    </div>
                                                
                                                </div>
                                            </Tooltip>
                                        </>
                                    )
                                })}
                            </div>
                            {activeEvent && (
                                <div className='col-md-12 mt-4'>
                                    <>
                                        <div className='py-3 d-flex align-items-center'>
                                            <h4 className='small font-weight-bold'>
                                                {activeEvent.eventTheme}
                                            </h4>
                                                <Tooltip title="Edit this child event" placement="right-start" arrow className='mx-3'>
                                                <span 
                                                    className={` pointer edit-button`}  
                                                    onClick={()=>{
                                                        setState({
                                                            showEditModal: true,  
                                                        })
                                                    }}
                                                >   
                                                    
                                                    <Edit
                                                        className="button-icon"
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        color={'#FFF'}
                                                    />
                                                </span>
                                            </Tooltip>
                                        </div>

                                        <div className='py-3'>
                                            <h2 className='small font-weight-bold'>Time</h2>
                                            <p className='small'>{activeEvent?.time}</p>   
                                        </div>
                                    </>
                                </div>
                            )}
                        </div>
                    </div> 
                </>
            )}
            
            {showCreateModal && (
                <AddChildEvent 
                    show={showCreateModal} 
                    toggleModal={toogleCreateModal} 
                    daydifference={daydifference} 
                    dayObject={dayObject} 
                    refresh={refresh}
                /> 
            )}
            {showEditModal && (
                <EditChildEvent 
                    show={showEditModal} 
                    toggleModal={toogleEditModal} 
                    daydifference={daydifference} 
                    dayObject={dayObject} 
                    currentEvent={activeEvent}
                    refresh={refresh} 
                /> 
            )}
        </>
    )
};

export default ViewCalenderEvent;