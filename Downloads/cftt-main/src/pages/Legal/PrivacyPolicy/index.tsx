import React from 'react';
import { privacyMarkDown } from './privacyMarkDown';
import ReactMarkdown from 'react-markdown';
const PrivacyPolicy = () => {
    return(
        <>
         <ReactMarkdown>
            {privacyMarkDown}
         </ReactMarkdown>
      
          
        </>
    )
};
export default PrivacyPolicy;