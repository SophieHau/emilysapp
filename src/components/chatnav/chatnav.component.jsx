import React from 'react';
import { Link } from 'react-router-dom';
import backIcon from '../../assets/icons/backarrow2.png';
import editIcon from '../../assets/icons/editicon.png';
import { firestore, auth, storageRef } from '../../firebase.utils';
import _ from 'lodash';
import defaultPic from '../../assets/icons/defaultprofilepic.png';

export class ChatNav extends React.Component {
  constructor(props) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = firestore.doc(`users/${user.uid}`);
        user = userRef.get().then((user) => {
          this.state['currentUser'] = user.data();
        });
      }
    });

    super(props);

    this.state = {
      chatId: this.props.chatId,
      chatName: '',
      currentUserName: '',
      chatImage: '',
      group: true,
    };
  }

  loadImageUrl = async (imagePath) => {
    const currentImageRef = storageRef.child(imagePath);
    const currentImageUrl = await currentImageRef.getDownloadURL();
    return currentImageUrl;
  };

  componentDidMount = async () => {
    if (window.location.search.includes(',')) {
      const index = window.location.search.indexOf(',');
      try {
        const currentUserRef = firestore.doc(
          `users/${window.location.search.slice(4, index)}`
        );
        const currentUserSnap = await currentUserRef.get();
        const currentUserName = currentUserSnap.data().displayName;
        this.setState({ currentUserName, group: true });
      } catch {
        const currentUserRef = firestore.doc(
          `users/${window.location.search.slice(index)}`
        );
        const currentUserSnap = await currentUserRef.get();
        const currentUserName = currentUserSnap.data().displayName;
        this.setState({ currentUserName });
      }
    }
    try {
      const currentUserRef = firestore.doc(
        `users/${window.location.search.slice(4)}`
      );
      const currentUserSnap = await currentUserRef.get();
      const currentUserName = currentUserSnap.data().displayName;
      this.setState({ currentUserName });
    } catch {
      const currentUserRef = firestore.doc(`users/${auth.currentUser.uid}`);
      const currentUserSnap = await currentUserRef.get();
      const currentUserName = currentUserSnap.data().displayName;
      this.setState({ currentUserName });
    }

    const currentChatRef = firestore.doc(`chats/${this.state.chatId}`);
    const currentChatSnap = await currentChatRef.get();
    if (currentChatSnap.data().imagePath) {
      const currentChatImagePath = currentChatSnap.data().imagePath;
      const currentChatImage = await this.loadImageUrl(currentChatImagePath);
      this.setState({ chatImage: currentChatImage });
    }

    let chatName = [];
    let images = [];
    firestore
      .collection('chats')
      .doc(`${this.state.chatId}`)
      .onSnapshot((snap) => {
        const participantsRefs = snap.data().participants;
        if (snap.data().name === '') {
          participantsRefs.forEach((participant) => {
            participant.get().then(async (res) => {
              const displayName = await res.data().displayName;
              chatName.push(` ${displayName}`);
              this.setState({ chatName });
              if (participantsRefs.length === 2) {
                if (!res.data().imagePath.includes(auth.currentUser.uid)) {
                  const pic = await this.loadImageUrl(res.data().imagePath);
                  images.push(pic);
                  this.setState({ chatImage: images, group: false });
                }
              }
            });
          });
        }
        this.setState({ chatName: snap.data().name });
      });
  };

  render() {
    let { chatName, currentUserName, chatImage, chatId } = this.state;
    chatName = chatName.toString();
    chatName = chatName.replace(currentUserName, '@You');

    if (chatName.length > 25) {
      chatName = chatName.slice(0, 20);
      return (
        <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
          <div className="dtc mr3 fl v-mid f6">
            <Link to={'/'}>
              <img
                src={backIcon}
                className="mt1 br-100 v-mid mr2"
                style={{ width: '25px', height: '25px' }}
                alt="arrow"
              />
            </Link>
            <img
              src={chatImage || defaultPic}
              className="mt1 h2 w2 br-100 v-mid"
              alt="profile"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="dtc v-mid fl">
            <p className="dark-gray f6 pa0 mr3">{chatName}...</p>
          </div>
          {this.state.group ? (
            <div className="dtc fr v-mid f6 mt2">
              <Link to={`/group-picture/${chatId}`}>
                <img
                  src={editIcon}
                  className="v-mid pt1"
                  style={{ width: '25px', height: '25px' }}
                  alt="arrow"
                />
              </Link>
            </div>
          ) : null}
        </nav>
      );
    }

    return (
      <nav className="dt w-90 center pt2 mb3 ml2 bb b--black-05">
        <div className="dtc mr3 fl v-mid f6">
          <Link to={{ pathname: '/' }}>
            <img
              src={backIcon}
              className="mt1 br-100 v-mid mr2"
              style={{ width: '25px', height: '25px' }}
              alt="arrow"
            />
          </Link>
          <img
            src={chatImage || defaultPic}
            className="mt1 h2 w2 br-100 v-mid"
            alt="profile"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="dtc v-mid fl">
          <p className="dark-gray f6 pa0 mr3">{chatName}</p>
        </div>
        {this.state.group ? (
          <div className="dtc fr v-mid f6 mt2">
            <Link to={`/group-picture/${chatId}`}>
              <img
                src={editIcon}
                className="v-mid pt1"
                style={{ width: '25px', height: '25px' }}
                alt="arrow"
              />
            </Link>
          </div>
        ) : null}
      </nav>
    );
  }
}
