
import PageTitle from 'components/PageTitle';
import React, {useEffect, useReducer} from 'react';
import './appointments.scss';
import { history } from 'helpers';
import { getUrlParams } from 'utils';
import AllAppointments from './AllAppointments';
import WeeklySchedule from './WeeklySchedule';
import { CalendarEvent, CalendarStats } from 'tabler-icons-react';


const Appointments = ():JSX.Element => {
    const initialState = {
        activeTab: 0,
        tabObject: {
            apostle_desk: 0,
            sermons: 1,
            bible_study: 2,
            bible_reading: 3,
            pastors_forum: 4
        }
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {activeTab, tabObject} = state;
    
    const tabs = [
        {
            path:'/appointments?tab=all_appointments',
            icon: (
                <CalendarStats
                    size={28}
                    strokeWidth={2}
                    color={'black'}
                />
            ),
            component: <><AllAppointments/> </>,
            title: 'All appointments',
        },
        {
            path:'/appointments?tab=weekly_schedule',
            icon: (
                <CalendarEvent
                    size={28}
                    strokeWidth={2}
                    color={'black'}
                />
            ),
            component: <><WeeklySchedule /></>,
            title: 'View calendar schedule',
        }

    ];
    const handleTabChange = (tabIndex: number):void => {
        setState({
            activeTab: tabIndex,
        });
        history.push(tabs[tabIndex].path);
    };
    
    useEffect(() => {
        const params:any = getUrlParams();
        const { tab } = params;
        if(tabObject[tab]){
            setState({
                activeTab: tabObject[tab]
            });
        }
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
    return(
        <div className='appointments'>
        <div className="col-md-12 px-0">
            <PageTitle text='Appointments' />
        </div>
        <div className="d-flex gap-3 bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            <div className='svg-container'>
                            {tab?.icon} &nbsp;
                            </div>
                            
                            {tab.title}
                            
                        </div>
                        
                    </>
                )
            })}
        </div>
        <div className="bg-white">
            {tabs[activeTab].component}
        </div>
       
       
        </div>
    )

};
export default Appointments;