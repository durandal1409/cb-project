import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import SmallItem from "../shared/SmallItem";
import ContactForm from "../shared/ContactForm";
import Button from "../shared/Button";
import ProfileForm from "./ProfileForm";

const Profile = () => {
    const { userId } = useParams();
    const { user } = useAuth0();
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);
    const [showProfileForm, setShowProfileForm] = useState(false);

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

    const handleMessage = (e) => {
        e.preventDefault();
    }
    
    return (
        sellerData &&
        <Wrapper>
            <Left>
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
            </Left>
            <Right>
            <h3>Listings</h3>
            <AdsWrapper>
                {!sellerAds
                    ?   sellerData
                            ?   <h3>{userId === 'me' ? "You have no ads." : "Seller has no ads."}</h3>
                            :   <h3>Loading...</h3>
                    :   sellerAds.map(ad => {
                            return <SmallItem
                                key={ad._id}
                                name={ad.name}
                                price={ad.price}
                                address={ad.address}
                                picSrc={ad.pic}
                                _id={ad._id}
                            />
                })}
            </AdsWrapper>
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
const Left = styled.div`
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

export default Profile;