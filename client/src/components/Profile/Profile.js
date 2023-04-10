import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import SmallItem from "../shared/SmallItem";
import ContactForm from "../shared/ContactForm";
import Button from "../shared/Button";
import ProfileForm from "./ProfileForm";
import CreateAd from "../CreateAd/CreateAd";

const Profile = () => {
    const { userId } = useParams();
    const { user } = useAuth0();
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
    const [showUpdateAd, setShowUpdateAd] = useState(null);

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

    const handleUpdateAd = (adId) => {
        fetch(`/api/ads/${adId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    // changing categories format in fetched data
                    // for CreateAd component
                    const adCategories = data.data.path.slice(1,-1).split(",");
                    setShowUpdateAd({...data.data, categories: adCategories});
                } else {
                    // window.alert(data.message)
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                throw new Error(error.message);
            })
    }
    const handleDeleteAd = (adId) => {
        setShowDeleteConfirmation(adId);
    }
    const handleDeleteCancel = (adId) => {
        setShowDeleteConfirmation(null);
    }
    const handleDeleteConfirm = (adId) => {
        fetch(`/api/ads/`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: _id,
                adId: adId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setSellerAds(sellerAds.filter(ad => ad._id !== data.data.adId));
                } else {
                    // window.alert(data.message);
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                // window.alert(error);
                throw new Error(error.message);
            })
    }

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
        setShowUpdateAd(null);
    }

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
                {!showUpdateAd
                    ?   <>
                            <h3>Listings</h3>
                            <AdsWrapper>
                                {!sellerAds
                                    ?   sellerData
                                            ?   <h3>{userId === 'me' ? "You have no ads." : "Seller has no ads."}</h3>
                                            :   <h3>Loading...</h3>
                                    :   sellerAds.map(ad => {
                                            return (
                                                <MyAdWrapper key={ad._id}>
                                                {userId === 'me' &&
                                                    <>

                                                        {showDeleteConfirmation !== ad._id
                                                        ?   <AdBtnsWrapper>
                                                                <Button 
                                                                    handleClick={() => handleUpdateAd(ad._id)}
                                                                    width="60px"
                                                                    className="update"
                                                                >
                                                                    Update
                                                                </Button>
                                                                <Button 
                                                                    handleClick={() => handleDeleteAd(ad._id)}
                                                                    width="60px"
                                                                    className="delete"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </AdBtnsWrapper>
                                                        :   <ConfirmDeleteBtnsWrapper>
                                                                <Button 
                                                                    handleClick={() => handleDeleteConfirm(ad._id)}
                                                                    width="40px"
                                                                >
                                                                    Yes
                                                                </Button>
                                                                <span>Delete ad?</span>
                                                                <Button 
                                                                    handleClick={() => handleDeleteCancel(ad._id)}
                                                                    width="40px"
                                                                >
                                                                    No
                                                                </Button>
                                                            </ConfirmDeleteBtnsWrapper>
                                                        }
                                                    </>
                                                }
                                                    <SmallItem
                                                        name={ad.name}
                                                        price={ad.price}
                                                        address={ad.address}
                                                        picSrc={ad.pic}
                                                        _id={ad._id}
                                                    />
                                                </MyAdWrapper>
                                            )
                                })}
                            </AdsWrapper>

                        </>
                    :   <>
                            <h3>Update ad</h3>
                            <CreateAd adData={showUpdateAd} handleAfterUpdate={handleAfterUpdate}/>
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