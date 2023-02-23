import React, {useReducer} from 'react';
import Messages from './Messages';
import Prayers from './Prayers';

const ApostleDesk = ():JSX.Element => {
    const initialState = {
        activeTab: 0,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {activeTab} = state;
   
    const tabs = [
        {
            key:'messages',
            component: <> <Messages/> </>,
            title: 'Messages',
        },
        {
            key:'prayer',
            component: <><Prayers/></>,
            title: 'Prayers',
        },
        
    ]

    return(
        <>
        <div className="row  py-4 px-4"> 
            <div className='col-md-12'>
                <h4 className='apostle-desk-header'> APOSTLE’S DESK POSTS</h4>
            </div>
            <div className='col-md-12 d-flex mb-1 mr-3 gap-30'>
                {tabs.map((tab, index)=>{
                    return(
                        <>
                            <div key={tab.key}>
                                <button 
                                    className={`py-2 ${activeTab === index? 'apostle-desk-active-nav text-white': 'apostle-desk-nav'}`} 
                                    onClick={()=> setState({activeTab: index})}
                                >
                                    {tab.title}
                                </button>
                            </div>
                        </>
                    );
                })}
                
                
            </div>
            <div className="bg-white">
                {tabs[activeTab].component}
            </div>
        </div>
       
       
        </>
    )

};
export default ApostleDesk;