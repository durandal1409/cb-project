import styled from "styled-components";
import { Link } from "react-router-dom";
import SmallItem from "./shared/SmallItem";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { smallAdsArr } from "../data";

const Home = () => {
    const [recommendedAds, setRecommendedAds] = useState(null);
    const [latestAds, setLatestAds] = useState(null);
    const { user } = useAuth0();
    useEffect(() => {
        setRecommendedAds(smallAdsArr);
    }, []);
    useEffect(() => {
        setLatestAds(smallAdsArr);
    }, []);
    return (
            <>
            <CategoriesWrapper>
                <CategoriesInnerWrapper>
                    <Category to={"/"}>Men</Category>
                    <Category to={"/"}>Women</Category>
                    <Category to={"/"}>Kids</Category>
                </CategoriesInnerWrapper>
            </CategoriesWrapper>
        <HomeWrapper>
            <h3>Recommended for you</h3>
            <AdsWrapper>
                {recommendedAds && recommendedAds.map(ad => {
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
        </>
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
    padding: 30px 0;
    background-color: var(--color-background-dark);
`
const CategoriesInnerWrapper = styled.div`
    width: var(--content-width);
    margin: auto;
    display: flex;
    justify-content: space-between;
`
const Category = styled(Link)`
    padding: 70px;
    border-radius: 20px;
    font-size: 2rem;
    text-decoration: none;
    background-color: #fff;
    &:hover {
        background-color: var(--color-background);
    }
`
const AdsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`

export default Home;