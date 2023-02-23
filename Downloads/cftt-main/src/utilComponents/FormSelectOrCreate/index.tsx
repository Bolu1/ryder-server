import { isNotEmptyArray } from 'utils';
import React from 'react';
// import FormSelect from '../FormSelect';
import { ActionMeta, OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
// import './FormGroupSelect.scss';
interface propInterface {
    errorMessage?: string;
    extraClass?: string;
    label?: string;
    labelClass?: string;
    selectClass?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: any;
    type?: string;
    name?: string;
    showError?: string | boolean;
    selectOptions?: { id?: number, name?: string, label?:string, value?: string|number, title?:string }[];
    //defaultValue?: { id?: number, name?: string, label?:string, value?: string|number, title?:string },
    isMulti?: boolean;
    optionKey?: null | string;
    defaultValue?:any
}
/**
 *
 * @param {*} param0
 */
const FormSelectOrCreate = ({
    errorMessage = '',
    extraClass = '',
    label = '',
    labelClass = '',
    // selectName,
    selectClass = '',
    showError = true,
    selectOptions = [],
    isMulti = false,
    optionKey = null,
    ...restInputProps
}: propInterface) => {
    let opt:any = [{ value: '', label: '--Select--' }];
    const newArr = [];
    if (isNotEmptyArray(selectOptions)) {
    
        if ((!selectOptions[0].label) || (!selectOptions[0].value)) {
            for (let index = 0; index < selectOptions.length; index++) {
                const element: any = selectOptions[index];
                let name = '';
                if (optionKey) {
                    name = element[optionKey];
                } else {
                    name = element.name ? element.name : element.title;
                }
                newArr.push({
                    label: name,
                    value: String(element.id),
                    id: element.id,
                    name: name,
                });
            }
            opt = newArr;
        } else {
            if(isMulti){
                opt = selectOptions;
            }else{
                opt = [...opt, ...selectOptions];
            }                
        }
    }

    return (
        <div className={` ${errorMessage ? 'formError' : ''} ${extraClass}`}>
            {label && <label className={labelClass}>{label}</label>}
            <CreatableSelect
                isClearable
                className={selectClass}
                // classNamePrefix="custom-select-input"
                isMulti={isMulti}
                // name={selectName}
                options={opt}
                {...restInputProps}
            />

            {showError && errorMessage && <span className="errorText small text-danger">{errorMessage}</span>}
        </div>
    );
};

export default FormSelectOrCreate;
