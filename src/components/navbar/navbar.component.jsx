import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../logo/logo.component';
import { auth } from '../../firebase.utils';


const Navigation = ({ currentUser }) => {
    if (currentUser) {
        return(
        <nav className="dt w-100 border-box pa3 ph5-ns">
            <div className="dtc v-mid mid-gray w-25">
                <Logo className="dib w2 h2 br-100" />
            </div>
            <div className="dtc v-mid w-75 tr" onClick={() => auth.signOut()}>
                <Link to={'/signin'} className="pointer link dim dark-gray f6 f5-ns dib mr3 mr4-ns mid-gray">Sign out</Link>
            </div>
        </nav>
        );
    } else {
        return(
            <nav className="dt w-100 border-box pa3 ph5-ns">
                <div className="dtc v-mid mid-gray w-25">
                    <Logo className="dib w2 h2 br-100" />
                </div>
                {/* <div className="dtc v-mid w-75 tr">
                    <Link to='/signin' className="pointer link dim dark-gray f6 f5-ns dib mr3 mr4-ns light-purple">Sign In</Link>
                    <Link to='/register' className="pointer link dim dark-gray f6 f5-ns dib hot-pink">Register</Link>
                </div> */}
            </nav>
        );
    }    
};

export default Navigation;