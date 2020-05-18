import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';
import addIcon from '../../assets/icons/newchaticon.png';
import { firestore, auth } from '../../firebase.utils';
import _ from 'lodash';


export class ChatNav extends React.Component {
    constructor(props) {

        auth.onAuthStateChanged(user => {
            if(user) {
                const userRef = firestore.doc(`users/${user.uid}`);
                user = userRef.get().then(user => {
                    this.state['currentUser'] = user.data()
                })
            }
        })

        super(props);

        this.state = {
            chatId: this.props.chatId,
            chatName: ''
        }
    }
    
    componentDidMount = async () => {
        const currentUserRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const currentUserSnap = await currentUserRef.get()
        const currentUserName = currentUserSnap.data().displayName
        firestore.collection('chats').doc(`${this.state.chatId}`)
        .onSnapshot(snap => {
            let name = snap.data().name
            if (name.includes(currentUserName)) {
                name = name.replace(currentUserName, "@You")
                name = _.trim(name, ', ')
            }
            this.setState({ chatName: name })
        })
    }

    render() {
        let { chatName, chatId } = this.state
        if (chatName.length > 30) {
            chatName = chatName.slice(0, 20)
            return (
                <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
                <div className="dtc mr3 fl v-mid f6">
                    <Link to="/"><img src={backIcon} className="mt1 br-100 v-mid mr2" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                    <img src="http://tachyons.io/img/logo.jpg" className="mt1 h2 w2 br-100 v-mid" alt="profile"/>
                </div>
                <div className="dtc v-mid fl">
                    <p className="dark-gray f6 pa0 mr3">{chatName}...</p>
                </div>
            </nav>
            )
        }

        return (
            <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
                <div className="dtc mr3 fl v-mid f6">
                    <Link to="/"><img src={backIcon} className="mt1 br-100 v-mid mr2" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                    <img src="http://tachyons.io/img/logo.jpg" className="mt1 h2 w2 br-100 v-mid" alt="profile"/>
                </div>
                <div className="dtc v-mid fl">
                    <p className="dark-gray f6 pa0 mr3">{chatName}</p>
                </div>
                <div className="dtc fr v-mid f6 mt2">
                    <Link to={`/addtochat/${chatId}`}><img src={addIcon} className="v-mid pt1" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                </div>
            </nav>
        )
    }
}

