import React from 'react';
import { Welcome } from '../components/welcome/welcome.component';
import { ProfileBox } from '../components/profilebox/profilebox.component';
import { ChatList } from '../components/chatlist/chatlist.component';


const HomePage = ({ currentUser }) => {
    if (currentUser) {
        return (
            <>
            <ProfileBox currentUser={currentUser}/>
            <ChatList currentUser={currentUser}/>
            </>
        )
    } else {
        return (
            <Welcome />
        )
    }
}

export default HomePage;