import React from 'react';
import sendIcon from '../../assets/icons/sendicon.jpg';

export const ChatInputBox = () => {
    return (
        <main className="fn bg-white center dib mt3">
            <form className="mb2 mb0-ns fl mr1 ml1">
                <div className="pb1 pt1 ba b--black-20 br4">
                    <input 
                        id="message" 
                        className="f6 w-75 ml1 mr1 pa2 input-reset ba b--white-20 input-reset outline-transparent" 
                        type="text"
                        placeholder="Type a message.."
                    />
                    <button
                        className="mr1 bg-transparent ba b--white-20 outline-transparent v-mid" 
                        type="submit"
                    >
                        <img type="submit" src={sendIcon} alt="paper plane" style={{width: '30px'}}/>
                    </button>
                </div>
            </form>
        </main>
    )
}

// createMessageDocument = () => {
//     firestore.collection('chats').doc('MaFSgwe99njRiTTkEyCq').collection('messages')
//     .add({ author: 'Soph', content: 'test2'})
//     const message = { author: 'Soph', content: 'test2'};
//     const { messages } = this.state;
//     messages.push(message)
//     this.setState({messages: messages})
// }

// <div>
// <input type="submit" onClick={this.createMessageDocument} />
// </div>