import styled from "styled-components";
import { useState, useContext } from "react";

import ContactForm from "../shared/ContactForm";
import Button from "../shared/Button";
import ProfileForm from "./ProfileForm";
import { UserContext } from "../UserContext";

// component for showing logged in user or seller profile info
const ProfileInfo = ({sellerData, userId}) => {
    // for showing update user info form
    const [showProfileForm, setShowProfileForm] = useState(false);
    const { userData } = useContext(UserContext);

    const handleMessage = (e) => {
        e.preventDefault();
    }

    return (
            <Wrapper>
                {
                    sellerData
                        ?   <>
                                { 
                                    userId === 'me'
                                        ?   <>
                                                <img src={userData.avatar} alt="my photo"/>
                                                <h4>{userData.fname} {userData.lname}</h4>
                                                <Button 
                                                    width="200px" 
                                                    handleClick={() => setShowProfileForm(true)}
                                                    className={showProfileForm ? "hide" : null}
                                                >
                                                    Update my profile
                                                </Button>
                                                <ProfileForm user={sellerData} showProfileForm={showProfileForm} setShowProfileForm={setShowProfileForm}/>
                                            </>
                                        :   <>
                                                <img src={sellerData.avatar} alt="seller photo"/>
                                                <h4>{sellerData.fname} {sellerData.lname}</h4>
                                                <ContactForm handleMessage={handleMessage}  sellerName={sellerData.fname}/>
                                            </>
                                }
                            </>
                        :   <h3>Loading...</h3>
                }
            </Wrapper>
    )
}

const Wrapper = styled.div`
    width: var(--small-block-width);
    display: flex;
    flex-direction: column;
    img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin-bottom: 10px;
    }
    h4 {
        margin-bottom: 10px;
    }
`
export default ProfileInfo;