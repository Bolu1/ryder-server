import { ArrowNarrowLeft } from "tabler-icons-react";
import React from 'react';

const BackButton = (props:any) => {
    const {close} = props;
    return(
        <span className='d-flex align-items-center pointer' onClick={()=>{ close()}}>
            <ArrowNarrowLeft
                size={30}
                strokeWidth={2}
                color={'black'}
            />
            &nbsp;&nbsp;Go back
        </span>
    );
}
export default BackButton;