import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';
import searchIcon from '../../assets/icons/searchfriendicon.png';


export const ContactNav = () => {
    return (
        <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
            <div className="dtc v-mid mid-gray tl">
                <Link to="/"><img src={backIcon} className="mt2 br-100" alt="arrow" style={{width: '25px', height: '25px'}}/></Link> 
            </div>
            <div className="v-mid ml3 mid-gray dtc">
                <p className="dark-gray f5 fw3 mt2 tl pt1">New chat</p>
            </div>
            <div className="dtc v-mid w-50 w-75-ns tr fw2">
                <Link to="/"><img src={searchIcon} className="mt2 br-100" alt="arrow" style={{width: '25px', height: '25px'}}/></Link> 
            </div>
        </nav>
    )
}
