import React, {useReducer} from 'react';
import PageTitle from 'components/PageTitle';
import AlertComponent from 'components/AlertComponent';
import { User ,Key } from 'tabler-icons-react';
import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';
import './settings.scss';

const Settings = ():JSX.Element => {
    const initialState = {
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:{},
        showEditModal: false,
        activeIndex:0,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, activeDataObj, alertMessage, activeIndex} = state;

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const settingsTab = () => {
        return [
            {
                name: 'Profile',
                component: <><UpdateProfile/></>,
                icon:(
                    <> 
                        <User
                            size={25}
                            strokeWidth={1.3}
                            color={'black'}
                        />
                    </>
                )
            },
            {
                name: 'Change Password',
                component: <><ChangePassword /></>,
                icon:(
                    <> 
                        <Key
                            size={25}
                            strokeWidth={1.3}
                            color={'black'}
                        />
                    </>
                )

            }
        ]
    };
    const list = settingsTab();
    return(
        <>
        <div className="row justify-content-between align-items-end">
            <div className="col-md-6">
                <PageTitle text='Settings' />
            </div>
        </div>  
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
            <div className="row">
                <div className="col-md-3 list-column border-right pr-0">
                {list.map((datum:any,_i:number) =>{
                    return(
                        <>
                            <div 
                                className={`
                                    d-flex pointer justify-content-between 
                                    align-items-start px-3 py-2 border-top border-bottom 
                                    ${activeIndex === _i? 'active-list':''}`
                                }
                                onClick={()=> setState({...state, activeIndex: _i})}
                            >
                
                                <div className="user-account d-flex align-items-center pr-3">
                                    <div className="avatar">
                                        
                                       {datum?.icon}
                                    </div>
                                    <div>
                                        {datum?.name}
                                    </div>
                                    
                                </div>
                               
                                
                            </div>
                        </>
                    )
                })}
                </div>
            
                <div className="col-md-8 px-4 py-4">
                    {list[activeIndex].component}
                </div>
            </div>
        </div>
        </>
    )

};
export default Settings;