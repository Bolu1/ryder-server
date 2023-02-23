import * as React from 'react';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(0),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 13,
    padding: '2px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

export default function BibleVersonSelection(props:any) {
  
  const [version, setVersion] = React.useState('niv');
  const handleChange = (event: { target: { value: string } }) => {
    setVersion(event.target.value);
    props.setVersion(event.target.value);
  };
  return (
    <div>
      <FormControl sx={{ m: 1 }} variant="standard">
       
        <NativeSelect
          id="demo-customized-select-native"
          value={version}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
            {props.bibleVersions?.map((item:any, index:any) => {
                return(
                    <>
                        <option value={item.translation}>{item.translation.toUpperCase()}</option>
                    </>
                )
            })}
        
        </NativeSelect>
      </FormControl>
    </div>
  );
}