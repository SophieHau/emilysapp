import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';
import addIcon from '../../assets/icons/newchaticon.png';
import { firestore, auth, storageRef } from '../../firebase.utils';
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
            chatName: '',
            currentUserName: '',
            chatImage: ''
        }
    }

    loadImageUrl = async (imagePath) => {
		const currentImageRef = storageRef.child(imagePath)
		const currentImageUrl = await currentImageRef.getDownloadURL()
		return currentImageUrl
	}
    
    componentDidMount = async () => {
        const currentUserRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const currentUserSnap = await currentUserRef.get()
        const currentUserName = currentUserSnap.data().displayName
        this.setState({currentUserName})
        let chatName = []
        let images = []
        firestore.collection('chats').doc(`${this.state.chatId}`)
        .onSnapshot(snap => {
            const participantsRefs = snap.data().participants
            if (snap.data().name === '') {
                participantsRefs.forEach(participant=> {
                    participant.get().then(async res=> {
                        const displayName = await res.data().displayName
                            chatName.push(` ${displayName}`)
                            this.setState({chatName})
                            if (!res.data().imagePath.includes(auth.currentUser.uid)) {
                                const pic = await this.loadImageUrl(res.data().imagePath)
                                images.push(pic)
                                this.setState({chatImage: images})
                            }
                    })
                })
            }
            this.setState({chatName: snap.data().name})
            })
    }

    render() {
        let { chatName, currentUserName, chatImage } = this.state
        chatName = chatName.toString()
        chatName = chatName.replace(currentUserName, "@You")

        if (chatName.length > 25) {
            chatName = chatName.slice(0, 20)
            return (
                <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
                <div className="dtc mr3 fl v-mid f6">
                    <Link to="/"><img src={backIcon} className="mt1 br-100 v-mid mr2" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                    <img src={chatImage} className="mt1 h2 w2 br-100 v-mid" alt="profile" style={{objectFit: 'cover'}}/>
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
                    <img src={chatImage} className="mt1 h2 w2 br-100 v-mid" alt="profile" style={{objectFit: 'cover'}}/>
                </div>
                <div className="dtc v-mid fl">
                    <p className="dark-gray f6 pa0 mr3">{chatName}</p>
                </div>
                {/* <div className="dtc fr v-mid f6 mt2">
                    <Link to={`/addtochat/${chatId}`}><img src={addIcon} className="v-mid pt1" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                </div> */}
            </nav>
        )
    }
}

