import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigDown } from 'tabler-icons-react';
import FinancialSupport from './FinancialSupport';
import './requests.scss';
import RideSharing from './RideSharing';
const Requests = ():JSX.Element => {
    const initialState = {
        activeTab: 0,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {activeTab} = state;
    const handleTabChange = (tabIndex: number):void => {
        setState({
            activeTab: tabIndex,
        });
    };

    const tabs = [
        {
            path:'/requests',
            component: <><FinancialSupport/> </>,
            title: 'Financial Support',
            count: 30
        },
        {
            path:'/requests',
            component: <><RideSharing /> </>,
            title: 'Ride Sharing',
            count: 11
        },
        {
            path:'/requests',
            component: <> <RideSharing /></>,
            title: 'Meeting appointment',
            count: 4
        },
        {
            path:'/requests',
            component: <> <RideSharing /></>,
            title: 'Created Jobs',
            count: 10
        },
    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Requests' />
        </div>
        <div className="d-flex bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            {tab.title}
                            <div className="tab-count text-center">{tab.count}</div>
                        </div>
                        
                    </>
                )
            })}
        </div>
        <div className="bg-white">
            {tabs[activeTab].component}
        </div>
       
       
        </>
    )

};
export default Requests;