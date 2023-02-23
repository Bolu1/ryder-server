import React, {useReducer} from 'react';
import { LayoutList } from 'tabler-icons-react';
// import './tablelistview.scss';
interface propsObject {
    isActive : boolean;
    actionEvent?: (e: React.SyntheticEvent) => any;
    className?: string;

  }
const TableListView = (props: propsObject):JSX.Element => {
    const {className, actionEvent, isActive } = props;
    return(
        <span 
            data-text="Toggle table and list view"
            className={`${className} pointer custom-tooltip left m-3`}
            onClick={actionEvent}
        >   
           <LayoutList
                size={30}
                strokeWidth={1.5}
                color={`${isActive? '#022389':'#000000'}`}
            />
        </span>
    );

};
export default TableListView;