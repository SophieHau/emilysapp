import React from 'react';
import { ContactNav } from '../components/contactnav/contactnav.component';


class CreateChat extends React.Component {
    constructor() {
        super()

        this.state = {

        }
    }

    render() {
        return (
            <>
            <ContactNav />
            <main className="mw6 center mt5">
                <article className="dt w-90 center bb b--black-05 pb2 mt2">
                    <div className="dtc w2 w3-ns v-mid">
                        <img src="http://mrmrs.github.io/photos/p/2.jpg" alt="" className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
                    </div>
                    <div className="dtc v-mid pl3">
                        <h1 className="f6 f5-ns fw4 lh-title black mv0">Young Gatchell username </h1>
                        <h2 className="f6 fw2 mt0 mb0 black-60">@ygstatus</h2>
                    </div>
                    <div className="dtc v-mid">
                        <form className="w-100 tr">
                        <button className="f6 button-reset pa2 bg-white ba b--black-10 dim pointer pv1 black-60 br4 outline-transparent">+ Chat</button>
                        </form>
                    </div>
                </article>
            </main>
            </>
        )
    }
}

export default CreateChat;