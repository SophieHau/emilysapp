import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';
import { firestore } from '../../firebase.utils';

export class ChatNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatName: ''
        }
    }

    componentDidMount = async () => {
        const chatRef = firestore.collection('chats').doc(`${this.props.chatId}`)
        const chatSnapshot = await chatRef.get();
        const chatName = chatSnapshot.data().name
        this.setState({ chatName })
    }

    render() {
        const { chatName } = this.state
        return (
            <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
                <div className="dtc mr3 fl v-mid f6">
                    <Link to="/"><img src={backIcon} className="mt1 br-100 v-mid mr2" style={{width: '25px', height: '25px'}} alt="arrow"/></Link> 
                    <img src="http://tachyons.io/img/logo.jpg" className="mt1 h2 w2 br-100 v-mid" alt="profile"/>
                </div>
                    
                <div className="dtc v-mid fl">
                    <p className="dark-gray f6 pa0 mr3">{chatName}</p>
                </div>
            </nav>
        )
    }
}

