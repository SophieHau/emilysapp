import React from 'react';
import { Link } from 'react-router-dom';
import newChatIcon from '../../assets/icons/newchaticon.png';
import { firestore } from '../../firebase.utils';

    


export class ProfileBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: this.props.currentUser
        }
    }

    createChatDocument = () => {
        firestore.collection('chats').add({name: 'chat4'})
    }

    render () {
        return (
            <article className="dt mw6 w-90 center bg-white br3 mb3 ba b--black-10 pa2">
                <div className="dtc w2 w3-ns v-mid">
                    <img src="http://tachyons.io/img/avatar_1.jpg" alt="" className="pa2 mr2 ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
                </div>
                <div className="dtc v-mid pl3">
                    <h1 className="f5 f3-l fw2 lh-title black mv0">Hi {this.state.currentUser.displayName}!</h1>
                    <h2 className="f7 f5-l mt2 fw2 mt0 mb0 black-60">Your status: "{this.state.currentUser.status}"</h2>
                </div>
                <div className="dtc fr">
                        <button className="f7 f6-l tr fw2 button-reset bg-white ba dib b--transparent dim pointer pv1 black-60 outline-transparent" type="submit">Edit</button>
                        <div className="mt2 mr1 mt4-l mt4-ns mb0-l tr">
                            <Link to="/newchat"><img type="submit" src={newChatIcon} onClick={this.createChatDocument} className="dib pointer dim" alt="message bubble" style={{width: '25px', height: '25px'}}/></Link>
                        </div>
                </div>
            </article>
        )
    }
}