import React, { useReducer } from "react";
import "./filter.scss";
interface propsObject {
  text: string;
  changeEvent?: (e: React.SyntheticEvent) => any;
  selectOptions?: Array<any>;
}
const Filter = (props: propsObject): JSX.Element => {
  const { selectOptions, text, changeEvent } = props;
  return (
    <div className={`filter px-2 py-1 mb-3 d-flex justify-content-between`}>
      <span className="text-muted small">{text}&nbsp;:</span>
      <select className="border-0 filter-select small" onChange={changeEvent}>
        <option value={"null"}>--Select option--</option>
        {selectOptions?.map((option: any, index: number) => {
          return (
            <>
              <option value={option.value} key={index}>
                {option.label}
              </option>
            </>
          );
        })}
      </select>
    </div>
  );
};
export default Filter;
