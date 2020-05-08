import React from 'react';
import { firestore, auth } from '../../firebase.utils';
import sendIcon from '../../assets/icons/sendicon.jpg';


export class ChatInputBox extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        }
    }

    createMessageDocument = (event) => {
        event.preventDefault();
        const chat_id = window.location.pathname.split('/')[2]
        const authorRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const message = {
            author: authorRef, 
            content: this.state.message,
            createdAt: new Date()
        }
        
        this.setState({message: message})
        console.log(message)
        firestore.collection('chats').doc(chat_id).collection('messages')
        .add(message)
        // const { messages } = this.state;
        // messages.push(message)
        // this.setState({messages: messages})
    }

    handleChange = (event) => {
        const {value, name} = event.target
        this.setState({ [name]: value})
    }

    render () {
        return (
            <main className="fn bg-white center dib mt3">
            <form className="mb2 mb0-ns fl mr1 ml1" onSubmit={this.createMessageDocument}>
                <div className="pb1 pt1 ba b--black-20 br4">
                    <input 
                        id="message" 
                        name="message"
                        className="f6 w-75 ml1 mr1 pa2 input-reset ba b--white-20 input-reset outline-transparent" 
                        type="text"
                        placeholder="Type a message..."
                        onChange={this.handleChange}
                    />
                    <button
                        className="mr1 bg-transparent ba b--white-20 outline-transparent v-mid" 
                        type="submit"
                        onClick={this.createMessageDocument}
                    >
                        <img src={sendIcon} alt="paper plane" style={{width: '30px'}}/>
                    </button>
                </div>
            </form>
        </main>
        )
    }
}
