import React from 'react';

export const ChatNav = ({ currentUser }) => {
    return (
        <nav className="dt w-90 center pt2 mb3 ml2 ph3 bb b--black-05">
            <div className="dtc mr3 fl v-mid f6">
                <img src="http://tachyons.io/img/logo.jpg" className="mt1 h2 w2 br-100 v-mid " alt="profile"/>
            </div>
                
            <div className="dtc v-mid fl">
                <p className="dark-gray f6 pa0 mr3">contact name or chat name</p>
            </div>
        </nav>
    )
}