import React, {useReducer} from 'react';
import { useHistory } from "react-router-dom";
 import './noaccess.scss';
import forbiddenIcon from 'assets/images/forbidden.svg';
import { ArrowBack } from 'tabler-icons-react';

const NoAccess = (props: any):JSX.Element => {
    let history = useHistory();

    return(
        <div 
            className='no-access-container'
        >   
            <div className='bg-white p-5 rounded'>
                <h5>You don't have permission to view this page</h5>
                <img src={forbiddenIcon} alt="No access" />
                <div className='mt-4 text-center'>
                    <button className='p-2 border-0 rounded' onClick={() => history.goBack()}>
                        <ArrowBack 
                            size={28}
                            strokeWidth={1}
                            color={'white'}
                        />&nbsp;Go Back to previous page
                    </button>
                </div>
            </div>
          
           
        </div>
    );

};
export default NoAccess;