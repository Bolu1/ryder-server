import React from 'react';
import SearchInput from 'utilComponents/SearchInput';
import supportIcon1 from 'assets/images/support_1.svg';
import supportIcon2 from 'assets/images/support_2.svg';
import planeIcon from 'assets/images/plane.svg';
import './support.scss';
import { Accordion } from 'utilComponents/AccordionAndSections';

const Support = () => {

    return (
        <div className='support-container'>
            <h4>CFT HELP CENTER</h4>
            <div className='d-flex justify-content-center'>
                <div className='support-body w-100'>
                
                   <div className='asked-questions'>
                       <div className='header'>
                        FREQUENTLY ASKED QUESTIONS
                       </div>
                       <div className='accordion-section'>
                           <Accordion sectionTitle="How do I watch past video streams on the mobile app?">
                                <div>All broadcasted videos of church programs are available for view on the CFT mobile 
                                    application’s Church videos section and also through the church’s 
                                    YouTube channel as linked here.
                                </div>
                            </Accordion> 
                            <Accordion sectionTitle="How do I contact pastors on the mobile app?">
                                <div>
                                    A new feature “Meet your pastor” is yet to be released on an update so there
                                    is no medium in the current system to contact pastors directly however one 
                                    can get conatct details of pastors from their profile page view as clicked from 
                                    the page view. Contact CFT Administrators for support here.
                                </div>
                            </Accordion> 
                            <Accordion sectionTitle="How can I donate on the app? ">
                                <div>
                                    The donations and offerings section is the channel through which users give 
                                    to the church. Donation for specific programmes or causes should be provided to
                                    enable allocation of funds to addressed department.
                                </div>
                            </Accordion> 
                            <Accordion sectionTitle="How do I highlight or store bible verses?">
                                <div>
                                    The bible verse view on the mobile application is without a 
                                    highlight function however a page view can be saved by clicking 
                                    the bookmark icon button for viewing later.
                                </div>
                            </Accordion> 
                       </div>
                   </div>
                   <div className='request-box'>
                       <div className="box text-center">
                           <div className="header">Can’t find what you need? Send us a request.</div>
                           <button>
                             <img src={planeIcon} />&nbsp;&nbsp;Submit a request
                           </button>
                       </div>
                   </div>
                </div>
            </div>
        </div>
    )
};

export default Support;