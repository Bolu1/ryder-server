import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter } from 'utils';
import './usercard.scss';
interface propsObject {
    name : string;
    userName? : string;
    time? : string;
    avatar? : string;
    id? : string;
    role?: string;
    active?: boolean;
    disableAccount: any;
    activateAccount: any;
    viewProfile?:any;
  }
const UserCard = (props: any):JSX.Element => {
    const {name, userName, time, role, avatar, active, disableAccount, activateAccount,id, viewProfile } = props;
    return(
        <div className={`card user-card w-100 p-3 mb-3`}>   
            <div className='d-flex justify-content-end'>
                {active? (
                    <>
                    {name? (
                        <Badges
                            text={'Active'}
                            type='success'
                            clickEvent={()=>disableAccount(id)}
                        />
                    ):(
                        <Badges
                            text={'Inactive'}
                            type='pending'
                            clickEvent={()=>activateAccount(id)}
                        />
                    )}
                        
                    </>
                ):(
                    <Badges
                        text={'Inactive'}
                        type='pending'
                        clickEvent={()=>activateAccount(id)}
                    />
                )}
                
            </div>
            <div className="d-flex align-items-center">
                <div className="">
                    <img src={avatar} className="user-profile-img" />
                </div>
                <div className="user-details">
                    <div className="name mb-1">{name}</div>
                    {userName && (<div className="user-name">Name:&nbsp;{capiitalizeFirstLetter(userName)}</div>)}
                    {role && (<div className="user-name">role:&nbsp;{role}</div>)}
                    <div className="small user-name text-muted mt-2">{time}</div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <div className="mr-3">
                    <Link to="#" onClick={()=> viewProfile(id)}>
                        View
                    </Link>
                </div>
                
                
            </div>
        </div>
    );

};
export default UserCard;