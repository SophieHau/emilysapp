import React from 'react';
import imageCompression from 'browser-image-compression';
import { storageRef, firestore, auth, getProfilePicUrl } from '../firebase.utils';
import Navigation from '../components/navbar/navbar.component';
import editIcon from '../assets/icons/editicon.png';
import { Redirect } from 'react-router-dom';

class EditPicture extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: this.props.currentUser,
            displayName: this.props.currentUser.displayName,
            currentImage: {},
            imagePath: '',
            compressedImage: {},
            redirect: null
        }
    }

    componentDidMount = async () => {
        const currentImageUrl = await getProfilePicUrl(this.state.currentUser)
        this.setState({imagePath: currentImageUrl})
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

    onSubmit = async (event) => {
        event.preventDefault();
        const userRef = firestore.doc(`users/${auth.currentUser.uid}`)
        const profilePicRef = storageRef.child(`${userRef.id}/images/profile/${this.state.compressedImage.name}`)
        await profilePicRef.put(this.state.compressedImage)

        await userRef.update({
            displayName: this.state.displayName,
            imagePath: profilePicRef.fullPath
        })
        this.setState({redirect: '/'})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { currentUser, displayName, imagePath } = this.state
        return (
            <>
            <Navigation currentUser={currentUser}/>
            <section className="tc pa3 pa5-ns w-100">
                <article className="relative ba b--black-20 br4 pa4 mw6 center w-100 shadow-5">
                    <img alt="" src={imagePath}  className="db"/>
                    <div className="pa2 bt b--black-20">
                        <input className="mt3 br-4 f4 fw2 w-75 ml1 mr1 pa2 input-reset ba b--white-20 outline-transparent w-90" value={displayName} name="displayName" onChange={this.handleChange}/>
                        <button 
                            className="pointer outline-transparent b--pink mr2 ml2 bg-transparent f6 grow no-underline br-pill ba ph3 pv2 mb2 hot-pink w4" 
                            type="submit"
                            onClick={this.handleSubmit}
                        >
                            Cancel
                        </button>
                        <button type="submit" onClick={this.onSubmit} className="outline-transparent b--hot-pink mr2 ml2 bg-transparent f6 grow no-underline br-pill ba ph3 pv2 mb2 pink w4 mt3">Save</button>
                    </div>
                    <img onClick={this.handleOpenImageSelect} className="child absolute top-1 o-50 right-1 grow no-underline br-100 w2 h2 pa2 lh-solid b" src={editIcon} alt="" />
                    <input type="file" hidden id="profilePic" accept="image/*" onChange={this.handleImageSelect} />
                </article>
            </section>
            </>
        )
    }
}

export default EditPicture;