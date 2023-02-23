import React, {useReducer} from 'react';
import { LetterX } from 'tabler-icons-react';
interface propsObject {
    text : string;
    type? : string;
    onClose?: (e: React.SyntheticEvent) => any;
    className?: string;
  }
const AlertComponent = (props: propsObject):JSX.Element => {
    const {className, text, type, onClose} = props;
    console.log(type,text);
    return(
        <div className={`alert ${type} d-flex w-100 my-3 justify-content-between align-items-center p-3`} role="alert">
            <div>{text} </div>
            <div 
                className="pointer"
                onClick={onClose}
            >
                <LetterX
                    size={22}
                    strokeWidth={2}
                    color={'#000000'}
                />
            </div>
        </div>
    );

};
export default AlertComponent;


