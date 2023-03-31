import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adDocument, userDocument, smallAdsArr } from "../data";

import SmallItem from "./shared/SmallItem";
import ContactForm from "./shared/ContactForm";

const Item = () => {
    const { itemId } = useParams();
    const [adData, setAdData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [similarAds, setSimilarAds] = useState(null);

    useEffect(() => {
        setAdData(adDocument);
        setSellerData(userDocument);
        setSimilarAds(smallAdsArr);
    }, []);

    const handleMessage = () => {

    }
    return (
        adData && <Wrapper>
            <CategoiesChain>
                Shoes > sneakers > size 10
            </CategoiesChain>
            <Main>
                <Left>
                    <AdTitle>{adData.name}</AdTitle>
                    <AdActions>Add to my favorites/update/delete</AdActions>
                    <PicWrapper>
                        <BigPic></BigPic>
                        <SmallPics>
                            <SmallPic></SmallPic>
                            <SmallPic></SmallPic>
                            <SmallPic></SmallPic>
                            <SmallPic></SmallPic>
                        </SmallPics>
                    </PicWrapper>
                    <Description>
                        <h4>Description:</h4>
                        <p>{adData.description}</p>
                        <h4>Address:</h4>
                        <p>{adData.address}</p>
                    </Description>
                    <SimilarAds>
                        <h3>Similar ads nearby</h3>
                        <AdsWrapper>
                            {similarAds && similarAds.map(ad => {
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
                    </SimilarAds>
                </Left>
                <Right>
                    <h2>${adData.price}</h2>
                    <ContactForm handleMessage={handleMessage} sellerName={sellerData.fname}/>
                    <SellerLink to={`/profile/${sellerData._id}`}>
                        <img src={sellerData.avatar} alt="seller photo"/>
                        <h4>{sellerData.fname} {sellerData.lname}</h4>
                    </SellerLink>
                </Right>
            </Main>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: var(--content-width);
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
`
const CategoiesChain = styled.div`
    margin-bottom: 10px;
`
const Main = styled.div`
    display: flex;
    justify-content: space-between;
`
const Left = styled.div`
    width: var(--big-block-width);
    display: flex;
    flex-direction: column;
`
const Right = styled.div`
    width: var(--small-block-width);
    display: flex;
    flex-direction: column;
    h2 {
        font-size: 2.5rem;
        margin-bottom: 50px;
    }
`
const AdsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`
const PicWrapper = styled.div`
`
const AdTitle = styled.div`
    font-size: 2rem;
    padding: 10px 0;
`
const BigPic = styled.div`
    width: 100%;
    height: 500px;
    border: 1px solid black;
    margin: 10px 0;
`
const SmallPics = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`
const SmallPic = styled.div`
    width: 70px;
    height: 70px;
    border: 1px solid black;
`
const AdActions = styled.div`
`
const Description = styled.div`
    h4 {
        font-size: 1.3rem;
        padding: 10px 0;
    }
`
const SimilarAds = styled.div`
    margin-top: 20px;
`

const SellerLink = styled(Link)`
    text-decoration: none;
    display: flex;
    align-items: center;
    margin-top: 20px;
    img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin-right: 10px;
    }
`
export default Item;