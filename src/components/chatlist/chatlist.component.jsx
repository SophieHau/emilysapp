import React from 'react';
import { firestore } from '../../firebase.utils';
import { Link } from 'react-router-dom';


export class ChatList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: this.props.currentUser,
			chats: []
		}
	}

	componentDidMount = () => {
		const chatListForCurrentUser = []
		const participantDocRef = firestore.collection('users').doc(`${this.state.currentUser.id}`);
		
        firestore.collection('chats').where("participants", "array-contains", participantDocRef).get()
         .then(response => {
             response.forEach(doc => {					
					chatListForCurrentUser.push({
						id: doc.id,
						name: doc.data().name,
						participants: doc.data().participants
					})
             })
             this.setState({chats: chatListForCurrentUser})
         })
         .catch (error => {
             console.log(error)
         })
    }

	render () {
		const { chats } = this.state;
		return (
			<ul className="center mw6 w-90 list pl0 mt3 measure center">
				{chats.map(chat =>
				 	
					<li key={chat.id} className="flex items-center lh-copy pa2 ph0-l bb b--black-10">
						<Link to={{ pathname:`./chat/${chat.id}` }}>
						<img className="w2 h2 w3-ns h3-ns br-100" src="http://tachyons.io/img/cat-720.jpg" alt="" />
						<div className="pl3">
						<span className="fw3 f6 db black-70">{chat.name}</span>
						</div>
						</Link>
					</li>	
				)}
			</ul>
		)
	}

}
