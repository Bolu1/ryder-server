import React, {useReducer} from 'react';
import './pagetitle.scss';
interface propsObject {
    text : string;
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;
  }
const PageTitle = (props: propsObject):JSX.Element => {
    const {className, text, actionEvent} = props;
    return(
        <div className={`title w-100 px-0 mb-3`}>   
            {text}
        </div>
    );

};
export default PageTitle;