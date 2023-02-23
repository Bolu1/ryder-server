
import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
// icons
import { Lock, MailForward, Users } from 'tabler-icons-react';
import AdministratorsList from './AdminLists';
import Roles from './Roles';
import Invites from './Invites';



const Administrators = ():JSX.Element => {
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
            icon: <Users size={24} strokeWidth={2} color={'black'} />,
            component: <> <AdministratorsList/> </>,
            title: 'Administrators',
        },
        {
            path:'/requests',
            icon: <Lock size={24} strokeWidth={2} color={'black'} />,
            component: <><Roles /> </>,
            title: 'Roles',
        },
        {
            path:'',
            icon: <MailForward size={24} strokeWidth={2} color={'black'} />,
            component: <><Invites /> </>,
            title: 'Invites',
        },
    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Administrators' />
        </div>
        <div className="d-flex  bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            <div className=''>
                            {tab.icon}&nbsp;
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
export default Administrators;
