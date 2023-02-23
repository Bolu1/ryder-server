import React, {useReducer} from 'react';
import './cardHeader.scss';
interface propsObject {
    text : string;
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
  }
const CardHeader = (props: propsObject):JSX.Element => {
    const {className, text, actionEvent} = props;
    return(
        <div className="section-header">   
            {text}
        </div>
    );

};
export default CardHeader;