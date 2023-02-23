import moment from 'moment';
import React, {useReducer, useEffect} from 'react';
import { extractErrorMessage, parseTime, processAlertError } from 'utils';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_APPOINTMENTS } from 'GraphQl/Queries';
import AlertComponent from 'components/AlertComponent';
import { connect } from 'react-redux';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils';
import { DivLoader } from 'utilComponents/Loader';
import ViewAppointment from '../ViewAppointment';

const WeeklySchedule =(props: any) => {
    const {user} = props;
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 600,
            page:0,
            totalRecords: 10,
        },
        isLoading: false,
        pageLoading: true,
        alertMessage:{},
        dataArr: [],
        activeAppointment:{},
        status: "Accepted",
        weekendsVisible: true,
        currentEvents: [],
        showViewModal: false,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        isLoading,
        pageLoading,
        alertMessage,
        dataArr,
        weekendsVisible,
        pagination,
        status,
        activeAppointment,
        showViewModal
    } = state;
    const { fetchMore } = useQuery(GET_ALL_APPOINTMENTS, {
        variables: {
          adminId: user?.id,
          page: 0,
          limit: 10,
          flag:status,
        },
    });

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

    const handleCalendarTimeFormat = (date:any, time: any) => {
        date = new Date(date).toISOString().replace(/T.*$/, '');
        time = parseTime(time);
        return `${date}T${moment(time).format("HH:mm:ss")}`;
    };
    
    const fetchData =  async (flag= status, paginationArgs = pagination) => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({
                    variables:{
                        adminId: user?.id,
                        page: paginationArgs?.page + 1,
                        limit: paginationArgs?.rowsPerPage,
                        flag: flag,
                    }
                });
         if(apiData.data){
             const data = apiData?.data?.getAppointments?.docs;
             for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    element.start = handleCalendarTimeFormat(element?.slot?.startDate, element?.slot?.startTime);
                    element.end = handleCalendarTimeFormat(element?.slot?.startDate, element?.slot?.endTime);
             }
        
            setState({
                dataArr: apiData?.data?.getAppointments?.docs,
                pagination:{
                    rowsPerPage: apiData?.data?.getAppointments?.limit,
                    page: apiData?.data?.getAppointments?.page - 1,
                    totalRecords: apiData?.data?.getAppointments?.totalDocs,
                },
                
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
                pageLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
                pageLoading: false,
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

    const renderEventContent= (eventContent: EventContentArg) => {
        return (
          <>
            <i>{eventContent.event?._def?.extendedProps?.slot?.startTime} - {eventContent.event?._def?.extendedProps?.slot?.endTime}</i>
            
          </>
        )
    }
    const handleWeekendsToggle = () => {
        setState({
          weekendsVisible: !weekendsVisible
        })
    };
    
    const handleEventClick = (clickInfo: EventClickArg) => {
        setState({
            activeAppointment: clickInfo?.event?._def?.extendedProps,
            showViewModal: true
        })
    };
    
    const handleEvents = (events: EventApi[]) => {
        setState({
          currentEvents: events
        });
    };
    const toggleViewAppointmentModal = () => {
        setState({
            activeAppointment: null,
            showViewModal: !showViewModal
        })
    };

    return (
        <>
        {pageLoading? (
            <>
                <DivLoader />
            </>
        ):(
            <>
                <div className='p-4 pt-5'>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        initialView='dayGridMonth'
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={weekendsVisible}
                        initialEvents={dataArr} // alternatively, use the `events` setting to fetch from a feed
                        // select={handleDateSelect}
                        eventContent={renderEventContent} // custom render function
                        eventClick={handleEventClick}
                        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                        /* you can update a remote database when these fire:
                        eventAdd={function(){}}
                        eventChange={function(){}}
                        eventRemove={function(){}}
                        */
                    />
                </div>
                {showViewModal && (
                    <>
                        <ViewAppointment
                            show={showViewModal}
                            toggleModal={toggleViewAppointmentModal}
                            appointment={activeAppointment}
                        />
                    </>
                )}
            </>
        )}
            
        </>
    )
};
function mapStateToProps(appState:any) {

    return {
       user: appState?.reducer?.userObject,
    };
 }
export default connect(mapStateToProps)(WeeklySchedule);