import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import ProfileInfo from "./ProfileInfo";
import ProfileAds from "./ProfileAds";
import CreateAd from "../CreateAd/CreateAd";
import { UserContext } from "../UserContext";

// logged in user or seller profile component
const Profile = ({favourites}) => {
    const { userId } = useParams();
    const { userData } = useContext(UserContext);
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);
    // for showing update ad form
    const [adToUpdate, setAdToUpdate] = useState(null);
    const [reload, setReload] = useState(false);
    const isLoggedInUser = userId === userData?._id;

    useEffect(() => {
        // fetching user data
        userId && fetch(`${process.env.REACT_APP_BASE_URL}/api/users/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setSellerData(data.data.user);
                    setSellerAds(data.data.ads);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
    }, [userId, reload]);

    // saving updated ad in state
    const handleAfterUpdate = (ad) => {
        setReload(!reload);
        setAdToUpdate(null);
    }

    
    return (
        sellerData &&
        <Wrapper>
            <ProfileInfo sellerData={sellerData} isLoggedInUser={isLoggedInUser}/>
            <Right>
                {!adToUpdate
                    ?   <ProfileAds 
                            sellerAds={sellerAds} 
                            setSellerAds={setSellerAds}  
                            isLoggedInUser={isLoggedInUser} 
                            favourites={favourites}
                            />
                    :   <>
                            <h3>Update ad</h3>
                            <CreateAd adData={adToUpdate} handleAfterUpdate={handleAfterUpdate}/>
                        </>
                }
            </Right>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    width: var(--content-width);
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
`
const Right = styled.div`
    width: var(--big-block-width);
    display: flex;
    flex-direction: column;
`


export default Profile;