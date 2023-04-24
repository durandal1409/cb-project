import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import ProfileInfo from "./ProfileInfo";
import ProfileAds from "./ProfileAds";
import CreateAd from "../CreateAd/CreateAd";
import { UserContext } from "../UserContext";

// logged in user or seller profile component
const Profile = ({favourites, my}) => {
    const { userId } = useParams();
    const { userData } = useContext(UserContext);
    const [sellerData, setSellerData] = useState(null);
    // for showing update ad form
    const [adToUpdate, setAdToUpdate] = useState(null);
    const [reload, setReload] = useState(false);

    // there are 3 scenarios for this component:
    // 1. Some user info and ads (favourites===undefined, my===undefined)
    // 2. Logged in user info and ads (favourites===undefined, my===true)
    // 3. Logged in user info and favourite ads (favourites===true, my===true)

    // show profile of a logged in user if userId from params equal to id of logged in user
    // or if component received prop my===true and we have logged in user
    const isLoggedInUser = (userId === userData?._id || (my || favourites && userData));

    useEffect(() => {
        // fetching user data
        const id = userId ?? userData?._id;
        id && fetch(`${process.env.REACT_APP_BASE_URL}/api/users/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setSellerData(data.data);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
    }, [userId, reload, userData, favourites]);

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
                            adsIds={favourites ? sellerData.favourites : sellerData.ads} 
                            isLoggedInUser={isLoggedInUser} 
                            favourites={favourites}
                            setAdToUpdate={setAdToUpdate}
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