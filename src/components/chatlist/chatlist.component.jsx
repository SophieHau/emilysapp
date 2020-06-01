import React from 'react';
import { firestore, auth } from '../../firebase.utils';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import '../chatboard/chatboard.style.css';


export class ChatList extends React.Component {
	constructor(props) {

		super(props);
		this.state = {
			chats: []
		}
	}


	componentDidMount = async () => {
		const chatListForCurrentUser = []
		const participantDocRef = firestore.collection('users').doc(`${auth.currentUser.uid}`);
		const currentUserName = await participantDocRef.get().then(res => {return res.data().displayName})
		
        firestore.collection('chats').where("participants", "array-contains", participantDocRef).get()
         .then(response => {
             response.forEach(doc => {		
					chatListForCurrentUser.push({
						id: doc.id,
						name: doc.data().name,
						participants: doc.data().participants
					})
             })
             this.setState({chats: chatListForCurrentUser, currentUserName})
         })
         .catch (error => {
             console.log(error)
         })
    }

	render () {
		const { chats, currentUserName } = this.state;
		return (
			<main className="wrapper">
			<ul className="center mw6 w-90 list pl0 mt3 measure">
				{chats.map(chat =>{
					if (chat.name.includes(currentUserName)) {
						chat.name = chat.name.replace(currentUserName, "")
						chat.name = _.trim(chat.name, ' , ')
					}
					return (
					<li key={chat.id} className="flex lh-copy pa2 ph0-l bb b--black-10">
						<Link to={{ pathname:`./chat/${chat.id}`}} className="no-underline pointer">
						<div className="dt">
							<img className="dtc w2 h2 w3-ns h3-ns br-100" style={{objectFit: 'cover'}} src="http://tachyons.io/img/cat-720.jpg" alt="" />
							<span className="dtc v-mid fw3 pl3 f6 f5-l db black-70">{chat.name}</span>
						</div>
						</Link>
					</li>
					)
					}
				)}
			</ul>
			</main>
		)
	}
}

