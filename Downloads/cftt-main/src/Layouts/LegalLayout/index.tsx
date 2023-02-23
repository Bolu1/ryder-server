import React, {useReducer, useState} from 'react';
import logoImage from 'assets/images/christ_faith_logo.svg';
import footerLogo from 'assets/images/footer_logo.svg';
import facebookLogo from 'assets/images/facebook.svg';
import instagramLogo from 'assets/images/instagram.svg';
import youtubeLogo from 'assets/images/youtube.svg';
import twitterLogo from 'assets/images/twitter.svg';
import { Link } from 'react-router-dom';

import './legal_layout.scss';
import { Menu2 } from 'tabler-icons-react';
const LegalLayout = (props: any): JSX.Element => {
    const [menuOpen, setMenuOpen]  = useState(false);

    const getMatch = (item:any) => {
        if(window.location.pathname.match(item)){
          return true;
        }
        return false;
    };
    return(
       <div className='legal-layout p-0 m-0'>
        <header>
            <nav className='d-flex align-items-end justify-content-between nav-menu'>
                <div className='logo-container'>
                    <img src={logoImage} alt="Christ Faith Church"/>
                </div>
                <ul className='d-flex ul-links'>
                    <li>
                        <Link to="/privacy-policy" className={`${getMatch(/^\/privacy-policy/)? 'active-nav': 'non-active-nav'}`}>Privacy Policy</Link>
                    </li>  
                    <li>
                     
                        <Link to="/terms-and-conditions" className={`${getMatch(/^\/terms-and-conditions/)? 'active-nav': 'non-active-nav'}`}>Terms and conditions</Link>
                    </li>
                    <li>
                     
                        <Link to="/support" className={`${getMatch(/^\/support/)? 'active-nav': 'non-active-nav'}`}>Support</Link>
                    </li>
                </ul>
                 {/* @ts-ignore */}
                <div className="mobile-menu" onClick={() =>setMenuOpen(!menuOpen)}>

                    <Menu2
                        size={30}
                        strokeWidth={2}
                        color={'black'}
                    />
                </div>
                
            </nav>
            {menuOpen && (
                <div className='mobile-link-container'>
                    <ul className='mobile-menu-links'>
                        <li>
                            <Link to="/privacy-policy" className={`${getMatch(/^\/privacy-policy/)? 'active-nav': 'non-active-nav'}`}>Privacy Policy</Link>
                        </li>  
                        <li>
                        
                            <Link to="/terms-and-conditions" className={`${getMatch(/^\/terms-and-conditions/)? 'active-nav': 'non-active-nav'}`}>Terms and conditions</Link>
                        </li>
                        <li>
                        
                            <Link to="/support" className={`${getMatch(/^\/support/)? 'active-nav': 'non-active-nav'}`}>Support</Link>
                        </li>
                    </ul>
                </div>
            )}
            
        </header>
            <div className='mark-down-content'>
                {props.children}
        
            </div>
        <footer>
            <div className='footer-container d-flex justify-content-center'>
                <div className='footer-logo d-flex align-items-center'>
                    <img src={footerLogo} />
                    <span>
                        &copy;&nbsp;2022&nbsp;CFT
                    </span>
                    
                </div>
                <div className='d-flex footer-icon-container'>
                    <div className='footer-icon'>
                        <img src={facebookLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={instagramLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={youtubeLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={twitterLogo} />
                    </div>
                </div>

            </div>
        </footer>

            
       </div>
    )
};

export default LegalLayout;