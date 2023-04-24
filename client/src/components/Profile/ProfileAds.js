import styled from "styled-components";
import { useEffect, useState } from "react";

import AdWithControls from "./AdWithControls";
import SmallItem from "../shared/SmallItem";

const ProfileAds = ({isLoggedInUser, favourites, adsIds, setAdToUpdate}) => {
    
    const [sellerAds, setSellerAds] = useState(null);
    const [loading, setLoading] = useState(false);

    // if it's a logged in user profile and we are showing user ads (not favourites)
    // then display ad controls (delete and update btns, etc.)
    const showControls = isLoggedInUser && !favourites;
    
    useEffect(() => {
        setLoading(true);
        // 1. prepare url with ads ids as query params
        const url = new URL(`${process.env.REACT_APP_BASE_URL}/api/ads`);
        const params = 'id=' + adsIds?.join('&id=');
        url.search = new URLSearchParams(params).toString();
        // 2. fetching ads
        adsIds && fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 200) {
                    setSellerAds(data.data);
                } else {
                    setSellerAds(null);
                    throw new Error(data.message);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                throw new Error(error.message);
            })
    }, [favourites, isLoggedInUser, adsIds]);

    return (
        loading
        ?   <h3>Loading...</h3>
        :   <>
            <h3>{favourites ? "My favourites" : "Listings"}</h3>
            
            <AdsWrapper>
                {!sellerAds
                    ?   <h3>{isLoggedInUser ? "You have no ads." : "Seller has no ads."}</h3>
                    :   sellerAds.map(ad => {
                            return (
                                showControls
                                    ?   <AdWithControls
                                            key={ad._id}
                                            ad={ad}
                                            sellerAds={sellerAds}
                                            setSellerAds={setSellerAds}
                                            setAdToUpdate={setAdToUpdate}
                                        />
                                    :   <SmallItem
                                            key={ad._id}
                                            name={ad.name}
                                            price={ad.price}
                                            address={ad.address}
                                            picSrc={ad.pic}
                                            _id={ad._id}
                                        />
                                
                                
                            )
                        })
                }
            </AdsWrapper>

        </>
    )
}

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

export default ProfileAds;