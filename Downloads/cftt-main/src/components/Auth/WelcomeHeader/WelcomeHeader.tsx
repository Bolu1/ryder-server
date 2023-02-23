import React, {useReducer} from 'react';
import './welcomeheader.scss';
interface propsObject {
    secondaryText? : string;
    mainText?: string;
  }
const WelcomeHeader = (props: propsObject):JSX.Element => {
    const {secondaryText, mainText} = props;
    return(
        <div>
        <h3 className="welcome-header">
           {mainText ||  'Welcome to Christfaith Tabernacle!'} 
        </h3>
        <p>
            {secondaryText}
        </p>
        </div>
    );

};
export default WelcomeHeader;