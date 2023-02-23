/* eslint-disable require-jsdoc */
import React, { useReducer } from 'react';
import './AccordionAndSectionStyle.scss';
import chervonUpIcon from 'assets/images/up-chevron.svg';
export const Section = ({ children, title, display }:any) => {
    const initialState = {
        open: display ? true : false,
        sectionClass: display ? 'section open' : 'section',
    };
    const [state, setState] = useReducer((state:any, newState:any) => ({ ...state, ...newState }), initialState);
    const { sectionClass, open } = state;
    const handleClick = () => {
        if (open) {
            setState({
                open: false,
                sectionClass: 'section',
            });
        } else {
            setState({
                open: true,
                sectionClass: 'section open',
            });
        }
    };

    return (
        <>
            <div className={`${sectionClass} border-bottom border-top px-2 py-3 rounded ${open ? 'mb-3' : 'mb-2'}`}>
                <div className="d-flex align-items-center justify-content-between px-2">
                    <div
                        className="sectionhead position-relative"
                        onClick={handleClick}
                    >
                        {title}
                    </div>
                    <img
                        className={open ? 'icon-rotated' : ''}
                        height={15}
                        src={chervonUpIcon}
                        width={15}
                    />
                </div>
                <div className="articlewrap">
                    <div className="article px-0">{children}</div>
                </div>
            </div>
        </>
    );
};
export const Accordion = ({ children, sectionTitle, display = false }:any) => {
    return (
        <>
            <div className="container-fluid px-0">
                <div className="m-0 p-0">
                    <Section
                        display={display}
                        title={sectionTitle}
                    >
                        {children}
                    </Section>
                </div>
            </div>
        </>
    );
};
