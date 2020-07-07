import React from 'react';
import { firestore, auth, storageRef } from '../../firebase.utils';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import '../chatboard/chatboard.style.css';
import defaultPic from '../../assets/icons/defaultprofilepic.png';



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

	loadChats = (list, id, images, groupName) => {
		if (images.length === 1) {
			let chat = {
				id,
				name: list.toString(),
				image: images
			}
			if (groupName) {
				chat = {
					id,
					name: groupName,
					image: images
				}
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
			snapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const participantsRef = change.doc.data().participants
					const groupChatName = change.doc.data().name

					let displayNameList = []
					let images = []
					if (change.doc.data().imagePath !== undefined) {
						const groupChatImagePath = await this.loadImageUrl(change.doc.data().imagePath.toString())
						images.push(groupChatImagePath)
					}

					participantsRef.forEach(ref => {
						ref.get().then(async res => {
							if (participantsRef.length === 2){
								if (!res.data().imagePath.includes(`${auth.currentUser.uid}`)) {
									const path = await this.loadImageUrl(res.data().imagePath.toString())
									images.push(path)
								}
							}

							displayNameList.push(` ${res.data().displayName}`)
						}).then(()=> {
							if (displayNameList.length === participantsRef.length ) {
								const newchat = this.loadChats(displayNameList, change.doc.id, images, groupChatName)
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
							<img className="dtc w3 h3 br-100" style={{objectFit: 'cover'}} src={chat.image || defaultPic} alt="" />
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

