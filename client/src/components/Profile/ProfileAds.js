import styled from "styled-components";

import AdWithControls from "./AdWithControls";

const ProfileAds = ({sellerAds, setSellerAds, isLoggedInUser, favourites}) => {
    
    // there are 2 scenarios for this component:
    // 1. if favourites prop === true, then display favourite ads of logged in user
    // 2. if not favourites and it's not logged in user profile, then
    //      show ads of this user 
    return (
        <>
            <h3>{favourites ? "My favourites" : "Listings"}</h3>
            
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
                {!sellerData
                    ?   <h3>Loading...</h3>
                    :   

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