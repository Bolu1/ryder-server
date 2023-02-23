import TextField from '@mui/material/TextField';
import React, {Component, Fragment, useState} from 'react';
import { usePlacesWidget } from "react-google-autocomplete";

const CustomAutoComplete = (props) => {
    const [country, setCountry] = useState("us");
    const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE,
    onPlaceSelected: (place) => props.onPlaceSelected(place),
    options: {
      types: ["(cities)"],
    },
   
  });
  return(
      <>
        
        <TextField
            className={'w-100'}
            label={'Search Location'}
            variant="outlined"
            size="small"
            inputRef={materialRef} 
                      
        />
      </>
  )
}

export default CustomAutoComplete;