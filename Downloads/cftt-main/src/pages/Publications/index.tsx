
import PageTitle from 'components/PageTitle';
import React, {useEffect, useReducer} from 'react';
import './publications.scss';
import ApostleDesk from './ApostleDesk';
import Sermons from './Sermons';
import BibleStudy from './BibleStudy';
import PastorsForum from './PastorsForum';
import { history } from 'helpers';
// icons
import apostleDeskIcon from 'assets/images/newspaper-folding.svg';
import sermonsIcon from 'assets/images/entertainment.svg';
import bibleStudyIcon from 'assets/images/book-one.svg';
import dailyBibleReadingIcon from 'assets/images/sunny.svg';
import pastorForumIcom from 'assets/images/peoples-two.svg';
import DailyBibleReading from './DailyBibleReading';
import { getUrlParams } from 'utils';


const Publications = ():JSX.Element => {
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
            path:'/publications?tab=apostle_desk',
            icon: apostleDeskIcon,
            component: <> <ApostleDesk/> </>,
            title: 'Apostle’s desk',
        },
        {
            path:'/publications?tab=sermons',
            icon: sermonsIcon,
            component: <><Sermons /></>,
            title: 'Sermons',
        },
        {
            path:'/publications?tab=bible_study',
            icon: bibleStudyIcon,
            component: <div className='bible-study'><BibleStudy /></div>,
            title: 'Bible study',
        },
        {
            path:'/publications?tab=bible_reading',
            icon: dailyBibleReadingIcon,
            component: <div className='bible-study'>< DailyBibleReading /></div>,
            title: 'Daily bible reading',
        },
        {
            path:'/publications?tab=pastors_forum',
            icon: pastorForumIcom,
            component: <div className='pastors-forum'><PastorsForum /></div>,
            title: 'Pastors forum',
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
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Publications' />
        </div>
        <div className="d-flex justify-content-between bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            <div className='svg-container'>
                            <img src={tab?.icon} className='svg-icon'/> &nbsp;
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
       
       
        </>
    )

};
export default Publications;