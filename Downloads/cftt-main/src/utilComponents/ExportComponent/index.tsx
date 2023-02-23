import React, {useReducer} from 'react';
import { LayoutList } from 'tabler-icons-react';
import './exportcomponent.scss';
import { TableExport } from 'tabler-icons-react';
interface propsObject {
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;

  }
const ExportComponent = (props: propsObject):JSX.Element => {
    const {className, actionEvent} = props;
    return(
        <span 
          
            className={`${className} pointer float-button m-3`}
            onClick={actionEvent}
        >   
           <TableExport
                className="float-icon"
                size={25}
                strokeWidth={1.5}
                color={'#FFF'}
            />
        </span>
    );

};
export default ExportComponent;