import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './loader.scss';
export default function CircularLoader() {
  return (
    // <div className='loader-container'>
    //   <div className="loader ">
    //       <Box sx={{ display: 'flex' }}>
    //           <CircularProgress 
    //               size={70}
    //               thickness={5}
    //           />
    //       </Box>
    //   </div>
    // </div>
    <div className=" div-loader text-center">
        {/* <Box sx={{ display: 'flex' }}> */}
          <div className='pt-5  mb-5 pt-3' />
            <CircularProgress 
                className="mt-5 mb-5"
                size={70}
                thickness={5}
            />
        {/* </Box> */}
    </div>
  );
};

export  function DivLoader() {
  return (
    <div className=" div-loader text-center">
        {/* <Box sx={{ display: 'flex' }}> */}
          <div className='mt-5  mb-5 pt-3' />
            <CircularProgress 
                className="mt-5 mb-5"
                size={70}
                thickness={5}
            />
        {/* </Box> */}
    </div>
  );
};