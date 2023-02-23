import React, { useReducer } from 'react';
import './searchinput.scss';
import { Search } from 'tabler-icons-react';


const SearchInput = (props: any): JSX.Element => {
    const { fetchData, handleSearchData, value } = props;
    const initialState = {
        search: value || '',
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const handleSubmit = (e : any) => {
        e.preventDefault();
        fetchData();

    };
    const handleChange = (e : any) => {
        handleSearchData(e?.target?.value);
        setState({
            ...state,
            search: e?.target?.value
        })
    }
    return (
        <div className="search-input">
            <div className="wrap">
                <form className="search" onSubmit={handleSubmit}>
                    <input type="text" className="searchTerm" placeholder="Search"  onChange={handleChange} value={state?.search} />
                        <button type="submit" className="searchButton">
                            <Search size={20} strokeWidth={2} color="#9CA3AF" />
                        </button>
                </form>
            </div>
        </div>
    );
};

export default SearchInput;
