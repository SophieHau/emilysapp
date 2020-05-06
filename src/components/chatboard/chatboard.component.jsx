import React from 'react';
// import { firestore } from '../../firebase.utils'; 


// export class ChatBoard extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             messages: []
//         }
//     }

//     componentDidMount = () => {
//         const message_list = []
//         firestore.collectionGroup('messages').get()
//          .then(response => {
//              response.forEach(doc => {
//              message_list.push({
//                  id: doc.id,
//                  content: doc.data().content,
//                  author: doc.data().author
//              })
//              })
//              this.setState({messages: message_list})
//          })
//          .catch (error => {
//              console.log(error)
//          })
//     }

//     createMessageDocument = () => {
//         firestore.collection('chats').doc('MaFSgwe99njRiTTkEyCq').collection('messages')
//         .add({ author: 'Soph', content: 'test2'})
//         const message = { author: 'Soph', content: 'test2'};
//         const { messages } = this.state;
//         messages.push(message)
//         this.setState({messages: messages})
//     }

//     createChatDocument = () => {
//         firestore.collection('chats').add({name: 'chat2'})
//     }

//     render () {
//         const { messages } = this.state;
//         return (
//             <div className="message-list-container">
//                 { messages.map(message => (
//                     <>
//                 <p key={message.id}>{message.author}{message.content}</p>
                
//                     <div>
//                     <input type="submit" onClick={this.createMessageDocument} />
//                     </div>
//                 </>
//                 ))}
//             </div>
//         )
//     }
// }

export const ChatBoard = () => {
    return (
        <main className="mw6 center">
            <article className="w-100 dib">
                <div className="fr dtc v-mid pl5">
                    <h1 className="mr2 f6 tl fw4 br4 ph3 pv2 dib mid-gray shadow-4 fr">Hello my name is sophie and i'm creating an app bla bla bla bla <p className="tr f7 fw2 mb0 mt2 black-60">Sophie | 12:32</p></h1>
                </div>
            </article>
            <article className="w-100 dib">
                <div className="dtc v-mid pr5">
                    <h1 className="f6 tl fw4 br4 ph3 pv2 mh2 bg-washed-green dib mid-gray shadow-4">That's awesome!<p className="tl f7 fw2 mb0 mt2 black-60">John | 12:40</p></h1>
                </div>
            </article>
            <article className="w-100 dib">
                <div className="dtc v-mid pr5">
                    <h1 className="f6 tl fw4 br4 ph3 pv2 mh2 bg-washed-green dib mid-gray shadow-4">Can you show it to me? I'm sure it's the best thing ever!<p className="tl f7 fw2 mb0 mt2 black-60">12:41</p></h1>
                </div>
            </article>
            <article className="w-100 dib">
                <div className="fr dtc v-mid pl5">
                    <h1 className="mr2 f6 tl fw4 br4 ph3 pv2 dib mid-gray shadow-4 fr">Shhhh it's still secret<p className="tr f7 fw2 mb0 mt2 black-60">12:42</p></h1>
                </div>
            </article>
            <article className="w-100 dib">
                <div className="fr dtc v-mid pl5">
                    <h1 className="mr2 f6 tl fw4 br4 ph3 pv2 dib mid-gray shadow-4 fr">Shhhh it's still secret<p className="tr f7 fw2 mb0 mt2 black-60">12:42</p></h1>
                </div>
            </article>
            <article className="w-100 dib">
                <div className="fr dtc v-mid pl5">
                    <h1 className="mr2 f6 tl fw4 br4 ph3 pv2 dib mid-gray shadow-4 fr">Shhhh it's still secret<p className="tr f7 fw2 mb0 mt2 black-60">12:42</p></h1>
                </div>
            </article>
            
        </main>
        
    )
}