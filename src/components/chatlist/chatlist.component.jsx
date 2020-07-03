import React from 'react';
import { firestore, auth, storageRef } from '../../firebase.utils';
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


	loadImageUrl = async (imagePath) => {
		const currentImageRef = storageRef.child(imagePath)
		const currentImageUrl = await currentImageRef.getDownloadURL()
		return currentImageUrl
	}

	loadChats = (list, id, images) => {
		if (images.length === 1) {
			let chat = {
				id,
				name: list.toString(),
				image: images
			}

			return chat
		}

		let chat = {
			id,
			name: list.toString()
		}
		return chat
	}
			
	componentDidMount = async () => {
		const participantDocRef = firestore.collection('users').doc(`${auth.currentUser.uid}`);
		const currentUserName = await participantDocRef.get().then(res => {return res.data().displayName})
		this.setState({currentUserName})
		let chats = []
		const chatsRef = firestore.collection('chats').where("participants", "array-contains", participantDocRef);
		chatsRef.onSnapshot(snapshot => {
			snapshot.docChanges().forEach(change => {
				if (change.type === 'added') {
					const participantsRef = change.doc.data().participants
					let displayNameList = []
					let images = []

					participantsRef.forEach(ref => {
						ref.get().then(async res => {
							if (!res.data().imagePath.includes(`${auth.currentUser.uid}`)) {
								const path = await this.loadImageUrl(res.data().imagePath.toString())
								images.push(path)
							}
							displayNameList.push(` ${res.data().displayName}`)
						}).then(()=> {
							if (displayNameList.length === participantsRef.length) {
								const newchat = this.loadChats(displayNameList, change.doc.id, images)
								chats.push(newchat)
								this.setState({chats})
							}
						})								
					})
				}
			})
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
							<img className="dtc w3 h3 br-100" style={{objectFit: 'cover'}} src={chat.image} alt="" />
							<span className="dtc v-mid fw3 pl3 f5 db black-70">{chat.name}</span>
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

