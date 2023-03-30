import styled from "styled-components";
import { useEffect, useState } from "react";
import { smallAdsArr, userDocument } from "../data";
import { useParams } from "react-router-dom";

import SmallItem from "./shared/SmallItem";
import ContactForm from "./shared/ContactForm";

const Profile = () => {
    const { itemId } = useParams();
    const [sellerData, setSellerData] = useState(null);
    const [sellerAds, setSellerAds] = useState(null);

    useEffect(() => {
        setSellerData(userDocument);
        setSellerAds(smallAdsArr);
    }, []);

    const handleMessage = () => {

    }
    return (
        sellerData &&
        <Wrapper>
            <Left>
                <img src={sellerData.avatar} alt="seller photo"/>
                <h4>{sellerData.fname} {sellerData.lname}</h4>
                <ContactForm handleMessage={handleMessage}  sellerName={sellerData.fname}/>
            </Left>
            <Right>
            <h3>Listings</h3>
            <AdsWrapper>
                {sellerAds && sellerAds.map(ad => {
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
    margin: 30px auto;
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
`

export default Profile;