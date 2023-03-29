import styled from "styled-components";
import { Link } from "react-router-dom";
import SmallItem from "./shared/SmallItem";
import { useEffect, useState } from "react";
import { smallAdsArr } from "../data";

const Home = () => {
    const [recommendedAds, setRecommendedAds] = useState(null);
    const [latestAds, setLatestAds] = useState(null);
    useEffect(() => {
        setRecommendedAds(smallAdsArr);
    }, []);
    useEffect(() => {
        setLatestAds(smallAdsArr);
    }, []);
    return (
        <HomeWrapper>
            <CategoriesWrapper>
                <Category to={"/"}>Men</Category>
                <Category to={"/"}>Women</Category>
                <Category to={"/"}>Kids</Category>
            </CategoriesWrapper>
            <h3>Recommended for you</h3>
            <AdsWrapper>
                {recommendedAds && recommendedAds.map(ad => {
                    return <SmallItem
                                key={ad._id}
                                name={ad.name}
                                price={ad.price}
                                address={ad.address}
                                picSrc={ad.pic}
                            />
                })}
            </AdsWrapper>
            <h3>Latest ads</h3>
            <AdsWrapper>
                {latestAds && latestAds.map(ad => {
                    return <SmallItem
                                key={ad._id}
                                name={ad.name}
                                price={ad.price}
                                address={ad.address}
                                picSrc={ad.pic}
                            />
                })}
            </AdsWrapper>
        </HomeWrapper>
    )
}

const HomeWrapper = styled.div`
    width: var(--content-width);
    margin: auto;
    display: flex;
    flex-direction: column;
`
const CategoriesWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
`
const Category = styled(Link)`
    padding: 70px;
    border-radius: 20px;
    font-size: 2rem;
    box-shadow: 0px 0px 24px -10px #000000;
    text-decoration: none;
    &:hover {
        background-color: var(--color-tertiary);
    }
`
const AdsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

export default Home;