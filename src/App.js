import React from 'react';
import { Switch, Route, MemoryRouter as Router, Redirect } from 'react-router-dom';
import './App.css';
import { auth, createUserProfileDocument } from './firebase.utils';
import HomePage from './pages/homepage.page';
import SignIn from './pages/signin.page';
import Register from './pages/register.page';
import ChatPage from './pages/chat.page';
import CreateChat from './pages/createChat.page';
import ContactSearch from './pages/contactsearch.page';
import EditPicture from './pages/editpicture.page';
import EditGroupPicture from './pages/editGroupPicture.page';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    }
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        
        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          });
        });
      } else {
        this.setState({currentUser: userAuth});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {

    return (
      <div className="App">
        <Router>
        {window.location.href !== window.location.origin+'/' ?
            < Redirect to={{
              pathname: window.location.pathname,
              // state: {
              //   currentUserid: window.location.search.slice(4)
              // }
            }} />: null
          }
          <Switch>
            <Route 
              exact path='/' 
              render={(props) => <HomePage {...props} currentUser={this.state.currentUser} />}
            />
            <Route
              exact path='/chat/:id'
              render={(props) => <ChatPage {...props} currentUser={this.state.currentUser} />}
            />
            <Route
              exact path='/newchat'
              component={CreateChat}
            />
            <Route
              exact path='/createchat'
              component={CreateChat}
            />
            <Route
              exact path='/searchcontact'
              component={ContactSearch}
            />
            <Route
              exact path='/picture'
              render={(props) => <EditPicture {...props} currentUser={this.state.currentUser} />}
            />
            <Route
              exact path='/group-picture/:id'
              render={(props) => <EditGroupPicture {...props} currentUser={this.state.currentUser} />}
            />
            <Route 
              exact path='/signin' 
              render={() => this.state.currentUser ? (<Redirect to='/' />) : (<SignIn />)} 
            />
            <Route 
              exact path='/register' 
              render={() => this.state.currentUser ? (<Redirect to='/' />) : (<Register />)}
            />
          </Switch>
        </Router>
      </div>
    );
  }
} 


export default App;
