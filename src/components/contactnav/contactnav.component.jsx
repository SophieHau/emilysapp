import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';

export const ContactNav = () => {
    return (
        <nav className="flex dt w-90 center pt2 mb3 ml2 bb b--black-05">
            <div className="dtc v-mid f5">
                <Link to="/"><img src={backIcon} className="mt2 br-100" alt="arrow" style={{width: '25px', height: '25px'}}/></Link> 
            </div>
            <div className="dtc v-mid center">
                <p className="dark-gray f5 fw3 mt2 pt1">Your contacts</p>
            </div>
        </nav>
    )
}