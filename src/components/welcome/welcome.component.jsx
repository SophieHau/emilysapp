import React from 'react';
import { Navigation } from '../navbar/navbar.component';
import { Link } from 'react-router-dom';


export const Welcome = () => {
    return (
        <>
        <Navigation />
        <header className="tc ph4 mt5">
            <h1 className="f3 f2-m f1-l fw2 black-90 mv3">
                Welcome to <span className="hot-pink">Emily's App</span>
            </h1>
            <h2 className="f5 f4-m f3-l fw2 black-50 mt0 lh-copy">
                A simple chat application for the whole family.
            </h2>
            <div className="ph3 mt5">
                <Link to='/signin' className="f6 grow no-underline br-pill ba ph3 pv2 mb2 dib hot-pink w4">Sign in</Link>
            </div>
            <div className="ph3 mt3">
                <Link to='/register' className="f6 grow no-underline br-pill ba ph3 pv2 mb2 dib pink w4">Register</Link>
            </div>
        </header>
        </>
    )
}

