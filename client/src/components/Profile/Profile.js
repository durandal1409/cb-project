import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import AdWithControls from "./AdWithControls";
import ProfileInfo from "./ProfileInfo";
import CreateAd from "../CreateAd/CreateAd";
import { UserContext } from "../UserContext";

// logged in user or seller profile component
const Profile = () => {
    const { userId } = useParams();
    const { userData } = useContext(UserContext);
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);
    // for showing update ad form
    const [adToUpdate, setAdToUpdate] = useState(null);
    const isLoggedInUser = userId === userData?._id;

    useEffect(() => {
        // fetching user data
        userId && fetch(`/api/users/${userId}`)
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
    }, [userId]);

    // saving updated ad in state
    const handleAfterUpdate = (ad) => {
        setSellerAds(() => {
            const newAds = [...sellerAds];
            newAds.map((item, ind) => {
                if (item._id === ad._id) {
                    newAds[ind] = ad
                }
                return item;
            })
            return newAds;
        })
        setAdToUpdate(null);
    }

    
    return (
        sellerData &&
        <Wrapper>
            <ProfileInfo sellerData={sellerData} isLoggedInUser={isLoggedInUser}/>
            <Right>
                {!adToUpdate
                    ?   <>
                            <h3>Listings</h3>
                            <AdsWrapper>
                                {!sellerAds
                                    ?   sellerData
                                            ?   <h3>{isLoggedInUser ? "You have no ads." : "Seller has no ads."}</h3>
                                            :   <h3>Loading...</h3>
                                    :   sellerAds.map(ad => {
                                            return (
                                                <AdWithControls
                                                    key={ad._id}
                                                    ad={ad}
                                                    userId={userId}
                                                    sellerAds={sellerAds}
                                                    setSellerAds={setSellerAds}
                                                    setAdToUpdate={setAdToUpdate}
                                                    isLoggedInUser={isLoggedInUser}
                                                />
                                            )
                                        })
                                }
                            </AdsWrapper>

                        </>
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
const AdsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
`
const MyAdWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
`
const AdBtnsWrapper = styled.div`
    display: flex;
    justify-content: center;
    & .update{
        border-radius: 7px 0 0 7px;
        border-right: 1px solid var(--color-background);
    }
    & .delete{
        border-radius: 0 7px 7px 0;
    }
`
const ConfirmDeleteBtnsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export default Profile;