import React, {useReducer} from 'react';
import { JsxElement } from 'typescript';
import './infodivheader.scss';

interface propsObject {
    className?: string;
    label: string;
    text: string | JsxElement;
  }
const InfoDivHeader = (props: propsObject):JSX.Element => {
    const {className, label, text} = props;
    return(
        <div 
          
            className={`info-header d-flex `}

        >   
            <div className="label">
                {label}&nbsp;:&nbsp;&nbsp;
            </div>
            <div className="header-text">
                {text}
            </div>
           
        </div>
    );

};
export default InfoDivHeader;