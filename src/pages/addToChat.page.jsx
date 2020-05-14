import React from 'react';
import { Redirect } from 'react-router-dom';
import { ContactNav } from '../components/contactnav/contactnav.component';
import { firestore, auth } from '../firebase.utils';
import _ from 'underscore';


class AddToChat extends React.Component {
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
            redirect: null,
            chatId: this.props.match.params['id']
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

    addContactToChat = async (event) => {
        event.preventDefault();

        const newParticipantRef = firestore.doc(`users/${event.target.value}`);
        const chatRef = firestore.doc(`chats/${this.state.chatId}`);
        const chatSnapshot = await chatRef.get();
        const chatParticipants = chatSnapshot.data().participants;
        const participantsId = [];

        chatParticipants.forEach(doc => {
            participantsId.push(doc.id)
        })


        if (participantsId.includes(newParticipantRef.id)) {
            this.setState({ redirect: `/chat/${this.state.chatId}`})
        } 

        else if (!participantsId.includes(newParticipantRef.id)) {
            chatParticipants.push(newParticipantRef)
            participantsId.push(newParticipantRef.id)
            const dbChatsRef = firestore.collection('chats')
                .where("participants", "array-contains", newParticipantRef)
            const dbChatsSnapshot = await dbChatsRef.get();
            dbChatsSnapshot.forEach(doc => {
                const participantsIdList = []
                doc.data().participants.forEach(participant => {
                    participantsIdList.push(participant.id)
                })
                if (_.difference(participantsId, participantsIdList).length === 0) {
                    this.setState({ redirect: `/chat/${doc.id}`})
                } 
            })
        }

        console.log("whyyyyyyy")
        chatRef.update({
            participants: chatParticipants
        })
        
        this.setState({ redirect: `/chat/${this.state.chatId}`})
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
                                    className="f3 button-reset pb1 pl2 pr2 bg-white ba b--black-10 dim pointer black-60 br-100 outline-transparent"
                                    value={contact.id}
                                    onClick={this.addContactToChat}
                                >
                                    +
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

export default AddToChat;