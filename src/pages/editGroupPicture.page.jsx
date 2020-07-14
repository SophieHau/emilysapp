import React from 'react';
import imageCompression from 'browser-image-compression';
import { storageRef, firestore, getProfilePicUrl } from '../firebase.utils';
import Navigation from '../components/navbar/navbar.component';
import editIcon from '../assets/icons/editicon.png';
import { Redirect } from 'react-router-dom';
import defaultPic from '../assets/icons/defaultprofilepic.png';


class EditGroupPicture extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentChatId: this.props.match.params.id,
            name: '',
            currentImage: {},
            imagePath: '',
            compressedImage: null,
            redirect: null
        }
    }

    componentDidMount = async () => {
        const currentChatRef = firestore.doc(`chats/${this.state.currentChatId}`)
        const currentChatSnap = await currentChatRef.get();
        if (currentChatSnap.data().imagePath) {
            const pic = await getProfilePicUrl(currentChatSnap.data())
            this.setState({imagePath: pic})
        }
        if (currentChatSnap.data().name) {
            this.setState({name: currentChatSnap.data().name})
        }
    }

    handleImageSelect = async (event) => {
        const imageFile = event.target.files[0];
       
        const options = {
          maxSizeMB: 0.6,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          this.setState({ imagePath: URL.createObjectURL(compressedFile), compressedImage: compressedFile })
          console.log(this.state.compressedImage)
        } catch (error) {
            console.log(error);
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    handleOpenImageSelect = () => {
        const fileInput = document.getElementById("profilePic");
        fileInput.click();
    }

    handleUpdateProfilePic = async (chatRef) => {
        const profilePicRef = await storageRef.child(`${chatRef.id}/images/profile/${this.state.compressedImage.name}`)
            await profilePicRef.put(this.state.compressedImage)
            console.log(profilePicRef)

            await chatRef.update({
                imagePath: profilePicRef.fullPath
            })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const chatRef = firestore.doc(`chats/${this.state.currentChatId}`)
        await chatRef.update({
                name: this.state.name
        })
        if (this.state.compressedImage !== null) {
            const chatRef = firestore.doc(`chats/${this.state.currentChatId}`)
            await this.handleUpdateProfilePic(chatRef)
        }
        this.setState({redirect: '/'})
    }

    handleCancel = (event) => {
        event.preventDefault();
        this.setState({redirect: '/'})
    }
       
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { currentChat, name, imagePath } = this.state
        return (
            <>
            <Navigation currentChat={currentChat}/>
            <section className="tc pa2 pa5-ns w-100">
                <article className="relative ba b--black-20 br4 pa3 mw6 center w-100 shadow-5">
                    <img alt="" className="center h5 w5" src={imagePath || defaultPic}  style={{objectFit: 'cover'}} />
                    <div className="pa1 b--black-20 db center">
                        <input className="center mt2 br-4 f4 fw2 ml1 mr1 pa2 input-reset ba b--white-20 outline-transparent w-50" value={name} placeholder="Add group name" name="name" onChange={this.handleChange} autoFocus/>
                        <div>
                        <div>
                        <button type="submit" onClick={this.onSubmit} className="mt3 outline-transparent b--hot-pink bg-transparent f6 grow no-underline br-pill ba ph3 pv2 mb2 pink w4 mt0">Save</button>
                        </div>
                        <button 
                            className="pointer outline-transparent b--pink mt1 bg-transparent f6 grow no-underline br-pill ba ph3 pv2 hot-pink w4" 
                            type="submit"
                            onClick={this.handleCancel}
                        >
                            Cancel
                        </button>
                        </div>
                        
                    </div>
                    <img onClick={this.handleOpenImageSelect} className="child absolute top-0 o-50 right-0 grow bg-white no-underline br-100 w2 h2 pa2 lh-solid b" src={editIcon} alt="" />
                    <input type="file" hidden id="profilePic" accept="image/*" onChange={this.handleImageSelect} />
                </article>
            </section>
            </>
        )
    }
}

export default EditGroupPicture;