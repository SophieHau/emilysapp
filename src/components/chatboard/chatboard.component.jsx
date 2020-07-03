import React from 'react';
import { firestore, auth, messaging } from '../../firebase.utils'; 
import sendIcon from '../../assets/icons/sendicon.jpg';
import './chatboard.style.css';


export class ChatBoard extends React.Component {
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
            messages: [],
            messageInput: '',
            newMessage: {},
            token: ''
        }
    }


    componentDidMount = () => {
        firestore.collection('chats').doc(this.state.chatId).collection('messages').orderBy('createdAt').limitToLast(20)
        .onSnapshot(snaphot => {
            snaphot.docChanges().forEach(change => {
                if (change.type === "added") {
                    const newMessage = {
                        id: change.doc.id,
                        content: change.doc.data().content,
                        createdAt: new Date(change.doc.data().createdAt * 1000).toString(),
                        author: change.doc.data().author
                    }
                    firestore.collection('users').doc(change.doc.data().author.id).get()
                    .then(author => {
                    const authorName = author.data().displayName
                    const authorColor = author.data().color
                    newMessage['author'] = authorName
                    newMessage['color'] = authorColor
                    const messages = this.state.messages
                    messages.push(newMessage)
                    this.setState({messages: messages})
                    })
                }
            })
        })

        this.scrollToBottom();
    }

    componentDidUpdate = () => {
        this.scrollToBottom();
    }

    sortArray = (array) => {
        array.sort((a, b) => {
            let da = new Date(a.createdAt),
                db = new Date(b.createdAt);
        return da - db;
        });
    }

    getToken = () => {
        messaging.getToken().then((currentToken) => this.setState({token: currentToken}))
    }

    sendNotification = () => fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=' + process.env.REACT_APP_FIREBASE_MESSAGING_KEY,
        },
        body: JSON.stringify({
            to: this.state.token,
            notification: {
                title: "test",
                body: "test body"
            }
        })
    })

          
    createMessageDocument = (event) => {
        event.preventDefault();

        const authorRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const newMessage = {
            author: authorRef, 
            content: this.state.messageInput,
            createdAt: new Date()
        }
        if (newMessage['content'] !== "") {
            firestore.collection('chats').doc(this.state.chatId).collection('messages')
            .add(newMessage)
            this.setState({messageInput: ''})
        }
    }
        
    handleChange = (event) => {
        const {value, name} = event.target
        this.setState({ [name]: value})
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView();
    }

    onFocus=(event) => {
        event.target.setAttribute('autocomplete', 'off');
    }

    render () {
        const { messages, currentUser } = this.state;
        this.sortArray(messages)

        return (
            <>
            <main className="mw6 wrapper w-90 center mb5-l mb1">
                    { messages.map(message => {
                        if (message.author === currentUser.displayName) { 
                                return (
                                    <article key={message.id} className="dib w-100">
                                        <div key={message.id} className="dtc v-mid pl5 tr fr">
                                        <h1 key={message.id} className="mr2 f6 tl fw4 br4 ph3 pv2 dib bg-washed-green mid-gray shadow-4 fr">{message.content} <p className="tr f7 fw2 mb0 mt1 black-60">{message.createdAt.substring(4,10)} | {message.createdAt.substring(16,21)}</p></h1>
                                        </div>
                                    </article>
                                );
                        } else {
                                return (
                                    <article key={message.id} className="w-100 dib">
                                    <div key={message.id} className="dtc v-mid pr5">
                                        <h1 key={message.id} className="f6 tl fw4 br4 ph3 pv2 mh2 dib mid-gray shadow-4">{message.content} <p className={`tr f7 fw4 ${message.color} mb0 mt2 black-60`}>{message.author} <span className="f7 fw2 black-60"> {message.createdAt.substring(4,10)} | {message.createdAt.substring(16,21)}</span></p></h1>
                                        </div>
                                    </article>
                                ) 
                        }
                    })
                    }
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
            </main>
            <form className="circle-form mw6 fn bg-white center dib w-90 mb3" onSubmit={this.createMessageDocument}>
                    <div className="pb1 pt1 ba b--black-20 br4">
                        <input 
                            id="messageInput" 
                            name="messageInput"
                            className="f6 w-75 ml1 mr1 pa2 input-reset ba b--white-20 outline-transparent" 
                            type="text"
                            value={this.state.messageInput}
                            placeholder="Type a message..."
                            onChange={this.handleChange}
                            autoFocus
                            onFocus={this.onFocus}
                        />
                        <button
                            className="mr1 fr bg-transparent ba b--white-20 outline-transparent v-mid" 
                            type="submit"
                            onClick={this.createMessageDocument}
                        >
                            <img src={sendIcon} alt="paper plane" style={{width: '30px'}}/>
                        </button>
                    </div>
                </form>
                
            </>
        )
    }
}