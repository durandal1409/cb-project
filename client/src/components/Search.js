import { useState, useEffect, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";
import styled from "styled-components";
import { GrMapLocation } from "react-icons/gr";
import { BsListUl } from "react-icons/bs";
import { smallAdsArr } from "../data";

import SmallItem from "./shared/SmallItem";
import Map from "./Map";
import Filters from "./Filters";

const Search = () => {
    // TODO:
    // change mapMode to false
    const [mapMode, setMapMode] = useState(true);
    const [filteredAds, setFilteredAds] = useState(null);
    const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY});

    useEffect(() => {
        setFilteredAds(smallAdsArr);
    }, []);

    return (
        mapMode
            ?   !isLoaded
                    ?   <div>Loading...</div>
                    :   <MapWrapper>
                            <Filters>

                            </Filters>
                            <IconWrapper>
                                <BsListUl onClick={() => setMapMode(false)} size={"2em"} />
                            </IconWrapper>
                            <Map />
                        </MapWrapper>
            :   <ListWrapper>
                    <Filters>

                    </Filters>
                    <List>
                        <IconWrapper>
                            <GrMapLocation onClick={() => setMapMode(true)} size={"2em"} />
                        </IconWrapper>
                        <AdsWrapper>
                            {filteredAds && filteredAds.map(ad => {
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
                    </List>

                </ListWrapper>
    )
}

const MapWrapper = styled.div`
    width: 100%;
    display: flex;
`
const ListWrapper = styled.div`
    width: var(--content-width);
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 30px;
`
const AdsWrapper = styled.div`
    margin-top: 35px;
    width: var(--big-block-width);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    a {
        margin-left: 10px;
    }
`
const List = styled.div`
`
const IconWrapper = styled.div`
    position: fixed;
    margin-left: 10px;
    svg {
        cursor: pointer;
        color: var(--color-paragraph);
        path {
            stroke: var(--color-paragraph);
        }
        &:hover path {
            stroke: var(--color-button-hover);
        }
        &:hover {
            color: var(--color-button-hover);
        }
    }
`
export default Search;