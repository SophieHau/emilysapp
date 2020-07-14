import React from 'react';
import { ChatBoard } from '../components/chatboard/chatboard.component';
import { ChatNav } from '../components/chatnav/chatnav.component';


class ChatPage extends React.Component {

    render () {
        let { id } = this.props.match.params

        return(
            <>
            <ChatNav chatId={id} />
            <ChatBoard chatId={id} />
            </>
        )
    }
}

export default ChatPage;