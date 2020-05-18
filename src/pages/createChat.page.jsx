import React from 'react';
import { Redirect } from 'react-router-dom';
import { ContactNav } from '../components/contactnav/contactnav.component';
import { firestore, auth } from '../firebase.utils';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import checkIcon from '../assets/icons/checkicon.png';


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
            redirect: null,
            groupMembers: [],
            groupName: "",
            currentUserChats: []
        }
    }

    componentDidMount = () => {
        const contactList = []
        const currentUserRef = firestore.collection('users').doc(`${auth.currentUser.uid}`)
        currentUserRef.onSnapshot(snapshot => {
            const currentUser = {
                id: snapshot.id,
                status: "",
                displayName: snapshot.data().displayName
            }

            this.state.groupMembers.push(currentUser)

            const friends = snapshot.data().friends
            friends.forEach(friend => {
                const contact = {
                    id: friend.id,
                    status: "+"
                }
                firestore.collection('users').doc(`${friend.id}`)
                .onSnapshot(snapshot => {
                    contact['displayName'] = snapshot.data().displayName
                    contactList.push(contact)
                    this.setState({ contacts: contactList})
                })
            })
        })
        const chatList = []
        const dbChats = firestore.collection('chats').where("participants", "array-contains", currentUserRef)
        dbChats.get()
        .then(dbChatsSnap => {
            if (!dbChatsSnap.empty) {
                dbChatsSnap.docs.forEach(dbChatSnap => {
                    const chat = {
                        id: dbChatSnap.id,
                    }
                    const partIdList = []
                    dbChatSnap.data().participants.forEach(partRef => {
                        partIdList.push(partRef.id)
                    })
                    chat['participantsId'] = partIdList
                    chatList.push(chat)
                    this.setState({ currentUserChats: chatList })
                })
            }
        })
    }

    addOrRemoveContactToGroup = async (event) => {
        event.preventDefault();
        const newParticipantRef = await firestore.doc(`users/${event.target.value}`);
        const newParticipantSnapshot = await newParticipantRef.get();
        const { groupMembers, contacts } = this.state;


        contacts.forEach(contact => {
            if (contact.id === newParticipantSnapshot.id && contact.status === "+") {
                contact.status = "–"

                const newMember = {
                    id: newParticipantSnapshot.id,
                    status: "–",
                    displayName: newParticipantSnapshot.data().displayName
                }

                const duplicate = []

                if (groupMembers.length > 0) {
                    groupMembers.forEach(member => {
                        if (member.id === newMember.id) {
                            duplicate.push(newMember)                }
                    })
                }
                
                if (duplicate.length === 0) {
                    groupMembers.push(newMember)
                }

                this.setState({ groupMembers })

            } else if (contact.id === newParticipantSnapshot.id && contact.status === "–") {
                _.remove(groupMembers, (contact))
                contact.status = "+"
                this.setState({ groupMembers, contacts })
            }
        })
    }    
      
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }
    
    onSubmit = async (event) => {
        event.preventDefault();
        const chatId = uuidv4();
        let { groupName, groupMembers, currentUserChats } = this.state
        const participantsRef = []
        const participantsNames = []
        const participantsId = []

        groupMembers.forEach(member => {
            participantsNames.push(member.displayName)
            participantsId.push(member.id)
            const memberRef = firestore.doc(`users/${member.id}`)
            participantsRef.push(memberRef)
        })

        if (groupName === "") {
            groupName = participantsNames.join(', ')
        }

        const newChat = {
            name: groupName,
            participants: participantsRef
        }

        if (groupMembers.length > 1) {
            const duplicates = []

            currentUserChats.forEach(chat => {
                const partsId = []
                chat.participantsId.forEach(partId => {
                    partsId.push(partId)
                })
                const diff1 = _.difference(participantsId, partsId)
                const diff2 = _.difference(partsId, participantsId)
                console.log(diff1)
                console.log(diff2)
                if (diff1.length === 0 && diff2.length === 0) {
                    duplicates.push(chat.id)
                }
                
            })
            console.log(duplicates)
            if (duplicates.length > 0 && duplicates.length < (groupMembers.length + 1)) {
                this.setState({ redirect: `/chat/${duplicates[0]}`})
            } else {
                firestore.collection('chats').doc(`${chatId}`).set(newChat)
                this.setState({ redirect: `/chat/${chatId}`})
            }
        }
    }

            
    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { contacts, groupMembers } = this.state;

        return (
            <>
            <ContactNav />
            <form className="black-80 center mw6" onSubmit={this.onSubmit}>
            <div className="dib center flex">
            <label htmlFor="name" className="tl ml2 dib f6 fw4 b db mb2">Group name: </label>
                </div>
                <div className="dib center flex">
                    <input 
                        className="center fw3 input-reset ba b--black-20 pa2-l db w-80 w-90-l" 
                        type="text" 
                        maxLength={20}
                        onChange={this.handleChange}
                        name="groupName"
                        id="groupName"
                        value={this.state.groupName}
                        required
                    />
                    <button
                            className="fr mr2 bg-transparent ba b--white-20 outline-transparent v-mid" 
                            type="submit"
                            onClick={this.onSubmit}
                        >
                            <img src={checkIcon} alt="paper plane" style={{width: '25px'}}/>
                    </button>
                </div>
             </form>
                <article className="mw6 center ml4">
                    <div className="tl ml2">
                    <h4 className="f6 fw3 black-60 dib">Added:</h4>
                    { groupMembers.map(member => {
                        if (member.id === auth.currentUser.uid) {
                            return (
                                <span key={member.id} className="f6 fw3"> @You </span>
                            )
                        } else {
                            return (
                                <span key={member.id} className="f6 fw3"> @{member.displayName} </span>
                            )
                        }
                    })}
                    </div>
                </article>
            <main className="mw6 center mt3">
                { contacts.map(contact => {
                        return(
                            <article key={contact.id} className="dt w-90 center bb b--black-05 pb2 mt2">
                                <div className="dtc w2 w3-ns v-mid">
                                    <img src="http://mrmrs.github.io/photos/p/2.jpg" alt="" className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns"/>
                                </div>
                                <div className="mt3 dtc v-mid pl3">
                                    <h1 className="tl f6 f5-ns fw3 lh-title black mv0">{contact.displayName}</h1>
                                </div>
                                <div className="dtc v-mid">
                                    <form className="w-100 tr">
                                    <button
                                        className="f3 button-reset pb1 pl2 pr2 bg-white ba b--black-10 dim pointer black-60 br-100 outline-transparent"
                                        value={contact.id}
                                        onClick={this.addOrRemoveContactToGroup}
                                    >
                                        {contact.status}
                                    </button>
                                    </form>
                                </div>
                            </article>
                        )
                    }
                )}
            </main>
            </>
        )
    }
}

export default CreateChat;