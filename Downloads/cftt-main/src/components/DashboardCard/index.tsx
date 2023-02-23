import React, {useReducer} from 'react';
import './dashboard.scss';
interface propsObject {
    text : string;
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
    icon?: any;
    count?: string

  }
const DashboardCard = (props: propsObject):JSX.Element => {
    const {className, text, actionEvent, count, icon} = props;
    return(
        <div className={`${className} card p-3`}>   
            <div>
                {text}
            </div>
            <div>
                <span>{count}</span>&nbsp;{icon}
            </div>
        </div>
    );

};
export default DashboardCard;