import React from 'react';
import { ContactNav } from '../components/contactnav/contactnav.component';
import searchIcon from '../assets/icons/searchicon.png';
import { firestore, auth } from '../firebase.utils';
import { Redirect } from 'react-router-dom';
import '../components/chatboard/chatboard.style.css';


class ContactSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchField: '',
            friends: [],
            contact: {},
            redirect: null
        }
    }

    componentDidMount = async () => {
        const currentUserRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const currentUserSnap = await currentUserRef.get()
        const currentUserFriends = currentUserSnap.data().friends
        if (currentUserFriends !== undefined) {
            this.setState({ friends: currentUserFriends})
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const searchInput = this.state.searchField
        const users = await firestore.collection('users').where("email", "==", searchInput)
        const usersSnap = await users.get()
        let contact = {}
        usersSnap.forEach(user => {
            contact = {
                id: user.id,
                displayName: user.data().displayName,
                email: user.data().email,
                status: "+"
            }
        })
        this.setState({contact})
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    addToFriends = async (event) => {
        event.preventDefault();
        const newFriendRef = await firestore.doc(`users/${event.target.value}`);
        const currentUserRef = await firestore.doc(`users/${auth.currentUser.uid}`)
        let { friends, contact } = this.state;
        const friendsId = []
        if (friends.length > 0) {
            friends.forEach(friend => {
                friendsId.push(friend.id)
            })
        } 

        if (contact.status === "+" && !friendsId.includes(contact.id)) {
            contact.status = "–"
            friends.push(newFriendRef)
            await currentUserRef.update({ friends })
            this.setState({ redirect: 'createchat/'})
        } else {
            return;
        }
    }
    

    render () {

        if (this.state.redirect) {
           return <Redirect to={this.state.redirect} />
        }

        const { contact } = this.state

        return (
            <>
            <ContactNav />
            <form className="black-80 center mw6" onSubmit={this.onSubmit}>
            <div className="dib center flex">
            <label htmlFor="name" className="tl ml2 dib f6 fw4 b db mb2">Enter your friend's email: </label>
                </div>
                <div className="dib center flex">
                    <input 
                        className="center fw3 input-reset ba b--black-20 pa2-l db w-80 w-90-l" 
                        type="text" 
                        onChange={this.handleChange}
                        name="searchField"
                        id="searchField"
                        value={this.state.searchField}
                        required
                    />
                    <button
                            className="fr pointer dim mr2 bg-transparent ba b--white-20 outline-transparent v-mid" 
                            type="submit"
                            onClick={this.onSubmit}
                        >
                            <img src={searchIcon} alt="paper plane" style={{width: '25px'}}/>
                    </button>
                </div>
             </form>
            
                <article className="mw6 center ml4">
                    <div className="tl ml2">
                        <h4 className="f6 fw3 black-60 dib">Search results:</h4>
                    </div>
                </article>
            <main className="mw6 center mt3 wrapper">
                <article className="dt w-90 center bb b--black-05 pb2 mt2">
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
                            onClick={this.addToFriends}
                        >
                            {contact.status}
                        </button>
                        </form>
                    </div>
                </article>
            </main>
            </>
        )
    }
}

export default ContactSearch;

