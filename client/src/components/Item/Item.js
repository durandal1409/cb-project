import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import SmallItem from "../shared/SmallItem";
import ContactForm from "../shared/ContactForm";
import PicsCarousel from "./Carousel";

const Item = () => {
    const { itemId } = useParams();
    const [adData, setAdData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [similarAds, setSimilarAds] = useState(null);


    const chainingFetches = async () => {
        try {
            // get ad info
            const itemRes = await fetch(`/api/ads/${itemId}`);
            const itemData = await itemRes.json();
            if (itemData.status === 200) {
                setAdData(itemData.data);
            } else {
                window.alert(itemData.message);
                throw new Error(itemData.message);
            }
            // get seller info
            const sellerRes = await fetch(`/api/users/${itemData.data.userId}`);
            const sellerData = await sellerRes.json();
            if (sellerData.status === 200) {
                setSellerData(sellerData.data);
            } else {
                window.alert(sellerData.message);
                throw new Error(sellerData.message);
            }
            //  get similar ads
            const similarRes = await fetch(`/api/ads/similar/${itemData.data.name}`);
            const similarData = await similarRes.json();
            if (similarData.status === 200) {
                setSimilarAds(similarData.data);
            } else {
                window.alert(similarData.message);
                throw new Error(similarData.message);
            }
        } catch(error) {
            window.alert(error);
        }
    }

    useEffect(() => {
        chainingFetches();
    }, []);

    const handleMessage = (e) => {
        e.preventDefault();
    }
    return (
        adData && <Wrapper>
            <CategoiesChain>
                {/* removing commas at the beginning and the end of a string, then change commas between words to > */}
                {adData.path.slice(1, -1).split(",").join(" > ")}
            </CategoiesChain>
            <Main>
                <Left>
                    <AdTitle>{adData.name}</AdTitle>
                    <AdActions>Add to my favorites/update/delete</AdActions>
                    <PicWrapper>
                        <PicsCarousel picsArr={adData.pics}/>
                    </PicWrapper>
                    <Description>
                        <h4>Description:</h4>
                        <p>{adData.description}</p>
                        <h4>Address:</h4>
                        <p>{adData.address}</p>
                    </Description>
                    <SimilarAds>
                        <h3>Similar ads</h3>
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
                    {sellerData && 
                    <>
                        <ContactForm handleMessage={handleMessage} sellerName={sellerData.fname}/>
                        <SellerLink to={`/profile/${sellerData._id}`}>
                            <img src={sellerData.avatar} alt="seller photo"/>
                            <h4>{sellerData.fname} {sellerData.lname}</h4>
                        </SellerLink>
                    </>
                    }
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
    gap: 10px;
`
const PicWrapper = styled.div`
`
const AdTitle = styled.div`
    font-size: 2rem;
    padding: 10px 0;
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