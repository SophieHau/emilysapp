import React from 'react';
import { firestore } from '../../firebase.utils'; 


export class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    componentDidMount = () => {
        const message_list = []
        firestore.collectionGroup('messages').get()
         .then(response => {
             response.forEach(doc => {
             message_list.push({
                 id: doc.id,
                 content: doc.data().content,
                 author: doc.data().author
             })
             })
             this.setState({messages: message_list})
         })
         .catch (error => {
             console.log(error)
         })
    }

    createMessageDocument = () => {
        firestore.collection('chats').doc('MaFSgwe99njRiTTkEyCq').collection('messages')
        .add({ author: 'Soph', content: 'test2'})
        const message = { author: 'Soph', content: 'test2'};
        const { messages } = this.state;
        messages.push(message)
        this.setState({messages: messages})
    }

    createChatDocument = () => {
        firestore.collection('chats').add({name: 'chat2'})
    }

    render () {
        const { messages } = this.state;
        return (
            <div className="message-list-container">
                { messages.map(message => (
                    <>
                <p key={message.id}>{message.author}{message.content}</p>
                
                    <div>
                    <input type="submit" onClick={this.createMessageDocument} />
                    </div>
                </>
                ))}
            </div>
        )
    }
}

