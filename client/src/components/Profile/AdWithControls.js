import styled from "styled-components";
import { useEffect, useState } from "react";

import SmallItem from "../shared/SmallItem";
import Button from "../shared/Button";

const AdWithControls = ({ad, userId, _id, setAdToUpdate, sellerAds, setSellerAds}) => {
    const [adToDeleteId, setAdToDeleteId] = useState(null);

    const handleUpdateAd = (adId) => {
        fetch(`/api/ads/${adId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    // changing categories format in fetched data
                    // for CreateAd component
                    const adCategories = data.data.path.slice(1,-1).split(",");
                    setAdToUpdate({...data.data, categories: adCategories});
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
        setAdToDeleteId(adId);
    }
    const handleDeleteCancel = () => {
        setAdToDeleteId(null);
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
                    setSellerAds([...sellerAds].filter(ad => ad._id !== data.data.adId));
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
    
    return (
        <Wrapper>
            {userId === 'me' &&
            <>
                {!adToDeleteId
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
                            handleClick={() => handleDeleteCancel()}
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
        </Wrapper>
    )
}

const Wrapper = styled.div`
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

export default AdWithControls;