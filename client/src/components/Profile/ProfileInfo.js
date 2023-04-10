import styled from "styled-components";
import { useState } from "react";

import ContactForm from "../shared/ContactForm";
import Button from "../shared/Button";
import ProfileForm from "./ProfileForm";

const ProfileInfo = ({sellerData, userId}) => {
    const [showProfileForm, setShowProfileForm] = useState(false);

    const handleMessage = (e) => {
        e.preventDefault();
    }

    return (
            <Wrapper>
                {
                    sellerData
                        ?   <>
                                <img src={sellerData.avatar} alt="seller photo"/>
                                <h4>{sellerData.fname} {sellerData.lname}</h4>
                                { 
                                    userId === 'me'
                                        ?   <>
                                                <Button 
                                                    width="200px" 
                                                    handleClick={() => setShowProfileForm(true)}
                                                    className={showProfileForm ? "hide" : null}
                                                >
                                                    Update my profile
                                                </Button>
                                                <ProfileForm user={sellerData} showProfileForm={showProfileForm} setShowProfileForm={setShowProfileForm}/>
                                            </>
                                        :   <ContactForm handleMessage={handleMessage}  sellerName={sellerData.fname}/>
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