import React, {useReducer} from 'react';
import './badges.scss';

interface propsObject {
    text: string | JSX.Element,
    type: string,
    clickEvent?: (e: React.SyntheticEvent) => any;
}
const Badges = (props: propsObject):JSX.Element => {
    const {text, type, clickEvent} = props;
    return(
        (clickEvent ?(
            <div 
                className="custom-badge pointer"
                onClick={clickEvent}
            >
                <span className={`px-2 py-1 badge-${type}`}>
                    {text}
                </span>
            </div>
        ):(
            <div className="custom-badge">
                <span className={`px-2 py-1 badge-${type}`}>
                    {text}
                </span>
            </div>
        ))
        
    );

};
export default Badges;