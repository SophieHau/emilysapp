import React from 'react';
import { Redirect } from 'react-router-dom';
import { ContactNav } from '../components/contactnav/contactnav.component';
import { firestore, auth } from '../firebase.utils';


class CreateChat extends React.Component {
    constructor(props) {
        auth.onAuthStateChanged(user => {
            if(user) {
                const userRef = firestore.doc(`users/${user.uid}`);
                user = userRef.get().then(user => {
                    this.state['currentUser'] = user.data()
                })
            }
        })
        super(props)

        this.state = {
            contacts: [],
            redirect: null
        }
    }

    componentDidMount = () => {
        const contactList = []
        firestore.collection('users').doc(`${auth.currentUser.uid}`)
        .onSnapshot(snapshot => {
            const friends = snapshot.data().friends
            friends.forEach(friend => {
                const contact = {
                    id: friend.id,
                }
                firestore.collection('users').doc(`${friend.id}`)
                .onSnapshot(snapshot => {
                    contact['displayName'] = snapshot.data().displayName
                    contact['status'] = snapshot.data().status
                    contactList.push(contact)
                    this.setState({ contacts: contactList})
                })
            })
        })
    }

    createChatDocument = async (event) => {
        event.preventDefault();
        const userRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const participantsRef = [userRef]
        const newParticipantId = event.target.value
        const newParticipantRef = firestore.doc(`users/${newParticipantId}`)
        participantsRef.push(newParticipantRef)
        const newParticipantSnapshot = await newParticipantRef.get();
        const chatName = await newParticipantSnapshot.data().displayName

        const newChat = {
            name: chatName,
            participants: participantsRef,
            createdAt: new Date(),
        }
        const newChatRef = firestore.collection('chats').where("name", "==", `${newChat['name']}`)
        const newChatSnapshot = await newChatRef.get()
        if (newChatSnapshot.empty) {
            firestore.collection('chats').add(newChat)
            const newChatSnapshot = await firestore.collection('chats').where("name", "==", `${newChat['name']}`).get()
            const newChatId = newChatSnapshot.docs[0].id
            this.setState({  redirect: `/chat/${newChatId}` })
        } else {
            const newChatId = newChatSnapshot.docs[0].id
            this.setState({ redirect: `/chat/${newChatId}` })
        }
    }


    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { contacts } = this.state;
        return (
            <>
            <ContactNav />
            <main className="mw6 center mt5">
                { contacts.map(contact => {
                    return(
                        <article key={contact.id} className="dt w-90 center bb b--black-05 pb2 mt2">
                            <div className="dtc w2 w3-ns v-mid">
                                <img src="http://mrmrs.github.io/photos/p/2.jpg" alt="" className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
                            </div>
                            <div className="mt3 dtc v-mid pl3">
                                <h1 className="tl f6 f5-ns fw3 lh-title black mv0">{contact.displayName}</h1>
                                <h2 className="tl f6 fw2 mt0 mb0 black-60">{contact.status}</h2>
                            </div>
                            <div className="dtc v-mid">
                                <form className="w-100 tr">
                                <button
                                    className="f6 button-reset pa2 bg-white ba b--black-10 dim pointer pv1 black-60 br4 outline-transparent"
                                    value={contact.id}
                                    onClick={this.createChatDocument}
                                >
                                    + Chat
                                </button>
                                </form>
                            </div>
                        </article>
                    )
                })}
            </main>
            </>
        )
    }
}

export default CreateChat;