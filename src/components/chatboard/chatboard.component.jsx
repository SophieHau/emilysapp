import React from 'react';
import { firestore, auth } from '../../firebase.utils'; 
import sendIcon from '../../assets/icons/sendicon.jpg';



export class ChatBoard extends React.Component {
    constructor() {
        super();
        this.state = {
            chatId: window.location.pathname.split('/')[2],
            messages: [],
            message: {},
            messageInput: ''
        }
    }

    componentDidMount = () => {
        const messageList = []
        firestore.collection('chats').doc(this.state.chatId).collection('messages').orderBy('createdAt').get()
        .then(response => {
            response.forEach(message => {
                const newMessage = {
                    id: message.id,
                    content: message.data().content,
                    createdAt: new Date(message.data().createdAt * 1000).toString()
                }
                firestore.collection('users').doc(message.data().author.id).get()
                .then(author => {
                    const authorName = author.data().displayName
                    newMessage['author'] = authorName
                    messageList.push(newMessage)
                    this.sortArray(messageList)
                    this.setState({messages: messageList})
                }) 
            })
        })
        .catch (error => {
            console.log(error)
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

    createMessageDocument = (event) => {
        event.preventDefault();
        const authorRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const newMessage = {
            author: authorRef, 
            content: this.state.messageInput,
            createdAt: new Date()
        }
        firestore.collection('chats').doc(this.state.chatId).collection('messages')
        .add(newMessage)

        firestore.collection('chats').doc(this.state.chatId).collection('messages').where("createdAt", "==", newMessage['createdAt']).get()
            .then(response => {
                response.forEach(message => {
                    newMessage['id'] = message.id;
                    newMessage['createdAt'] = new Date(message.data().createdAt * 1000).toString();
                    newMessage['author'] = auth.currentUser.displayName;
                })
                const { messages } = this.state;
                messages.push(newMessage)
                this.setState({messages: messages, messageInput: ''})                
            })
            .catch (error => {
            console.log(error)
            })        
    }

    handleChange = (event) => {
        const {value, name} = event.target
        this.setState({ [name]: value})
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    render () {
        const { messages } = this.state;
        return (
            <main className="mw6 center">
                    { messages.map(message => {
                        if (message.author === auth.currentUser.displayName) { 
                                return (
                                    <article key={message.id} className="dib w-100">
                                        <div key={message.id} className="dtc v-mid pl5 tr fr">
                                        <h1 key={message.id} className="mr2 f6 tl fw4 br4 ph3 pv2 dib mid-gray shadow-4 fr">{message.content} <p className="tr f7 fw2 mb0 mt2 black-60">{message.author} | {message.createdAt.substring(16,21)}</p></h1>
                                        </div>
                                    </article>
                                );
                        } else {
                                return (
                                    <article key={message.id} className="w-100 dib">
                                    <div key={message.id} className="dtc v-mid pr5">
                                        <h1 key={message.id} className="f6 tl fw4 br4 ph3 pv2 mh2 bg-washed-green dib mid-gray shadow-4">{message.content} <p className="tr f7 fw2 mb0 mt2 black-60">{message.author} | {message.createdAt.substring(16,21)}</p></h1>
                                        </div>
                                    </article>
                                ) 
                        }
                    })
                    }
                <form className="fn bg-white center dib w-90 mt3 mb2 mb0-ns" onSubmit={this.createMessageDocument}>
                    <div className="pb1 pt1 ba b--black-20 br4">
                        <input 
                            id="messageInput" 
                            name="messageInput"
                            className="f6 w-75 ml1 mr1 pa2 input-reset ba b--white-20 input-reset outline-transparent" 
                            type="text"
                            value={this.state.messageInput}
                            placeholder="Type a message..."
                            onChange={this.handleChange}
                            autoFocus
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
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </main>
        )
    }
}