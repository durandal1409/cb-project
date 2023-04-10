import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import AdWithControls from "./AdWithControls";
import ProfileInfo from "./ProfileInfo";
import CreateAd from "../CreateAd/CreateAd";

const Profile = () => {
    const { userId } = useParams();
    const { user } = useAuth0();
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);
    const [adToUpdate, setAdToUpdate] = useState(null);

    // if user wants to see theit own profile
    // useParams will have 'me'
    // if it's somebody else profile then useParams will have that seller id
    const _id = userId === 'me' ? user?.sub : userId;

    useEffect(() => {
        // fetching user data
        _id && fetch(`/api/users/${_id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setSellerData(data.data.user);
                    setSellerAds(data.data.ads);
                } else {
                    // window.alert(data.message);
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                // window.alert(error);
                throw new Error(data.message);
            })
    }, [_id]);

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
            <ProfileInfo sellerData={sellerData} userId={userId}/>
            <Right>
                {!adToUpdate
                    ?   <>
                            <h3>Listings</h3>
                            <AdsWrapper>
                                {!sellerAds
                                    ?   sellerData
                                            ?   <h3>{userId === 'me' ? "You have no ads." : "Seller has no ads."}</h3>
                                            :   <h3>Loading...</h3>
                                    :   sellerAds.map(ad => {
                                            return (
                                                <AdWithControls
                                                    key={ad._id}
                                                    ad={ad}
                                                    // id from params (for logged in user === 'me')
                                                    userId={userId}
                                                    // real id (for logged in user - from OAuth0)
                                                    _id={_id}
                                                    sellerAds={sellerAds}
                                                    setSellerAds={setSellerAds}
                                                    setAdToUpdate={setAdToUpdate}
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