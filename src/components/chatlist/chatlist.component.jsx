import React from 'react';
import { firestore, auth } from '../../firebase.utils';
import { Link } from 'react-router-dom';


export class ChatList extends React.Component {
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
			chats: []
		}
	}
	

	componentDidMount = () => {
		const chatListForCurrentUser = []
		const participantDocRef = firestore.collection('users').doc(`${auth.currentUser.uid}`);
		
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
			<ul className="center mw6 w-90 list pl0 mt3 measure">
				{chats.map(chat =>{
					return (
					<li key={chat.id} className="flex lh-copy pa2 ph0-l bb b--black-10">
						<Link to={{ pathname:`./chat/${chat.id}`}} className="no-underline pointer">
						<div className="dt">
							<img className="dtc w2 h2 w3-ns h3-ns br-100" src="http://tachyons.io/img/cat-720.jpg" alt="" />
							<span className="dtc v-mid fw3 pl3 f6 f5-l db black-70">{chat.name}</span>
						</div>
						</Link>
					</li>
					)
					}
				)}
			</ul>
		)
	}
}

