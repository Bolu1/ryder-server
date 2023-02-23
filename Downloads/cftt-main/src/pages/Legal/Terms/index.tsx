import React from 'react';
import { termsMarkDown } from './termsMarkDown';
import ReactMarkdown from 'react-markdown';
const Terms = () => {
    return(
        <>
         <ReactMarkdown>
            {termsMarkDown}
         </ReactMarkdown>
      
          
        </>
    )
};
export default Terms;