import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../logo/logo.component';
import { auth } from '../../firebase.utils';


export const Navigation = ({ currentUser }) => {
    if (currentUser) {
        return(
        <nav className="dt w-100 border-box pa3 ph5-ns">
            <div className="dtc v-mid mid-gray w-25">
                <Link to="/" className="outline-transparent pointer"><Logo className="dib w2 h2 br-100 outline-transparent"/></Link>
            </div>
            <div className="dtc v-mid w-75 tr fw2" onClick={() => auth.signOut()}>
                <Link to={'/signin'} className="pointer link dim dark-gray f6 f5-ns dib mr3 mr4-ns mid-gray">Sign out</Link>
            </div>
        </nav>
        );
    } else {
        return(
            <nav className="dt w-100 border-box pa3 ph5-ns">
                <div className="dtc v-mid mid-gray w-25">
                    <Link to="/" className="outline-transparent"><Logo className="dib w2 h2 br-100" /></Link>
                </div>
                {/* <div className="dtc v-mid w-75 tr">
                    <Link to='/signin' className="pointer link dim dark-gray f6 f5-ns dib mr3 mr4-ns light-purple fw2">Sign In</Link>
                    <Link to='/register' className="pointer link dim dark-gray f6 f5-ns dib hot-pink fw2">Register</Link>
                </div> */}
            </nav>
        );
    }    
};

