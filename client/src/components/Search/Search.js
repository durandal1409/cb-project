import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import styled from "styled-components";
import { GrMapLocation } from "react-icons/gr";
import { BsListUl } from "react-icons/bs";

import SmallItem from "../shared/SmallItem";
import Map from "./Map";
import Filters from "./Filters";

// component for search page where you can
// filter ads by category
// and show them as a list or on a map
const Search = () => {
    // for switching between map mode and list mode
    const [mapMode, setMapMode] = useState(false);
    const [filteredAds, setFilteredAds] = useState(null);
    const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY});

    return (
        mapMode
            ?   !isLoaded
                    ?   <div>Loading...</div>
                    :   <MapWrapper>
                            <Filters setFilteredAds={setFilteredAds} />
                            <IconListWrapper>
                                <BsListUl onClick={() => setMapMode(false)} size={"2em"} />
                            </IconListWrapper>
                            <Map filteredAds={filteredAds}/>
                        </MapWrapper>
            :   <ListWrapper>
                    <Filters setFilteredAds={setFilteredAds} />
                    <List>
                        <IconMapWrapper>
                            <GrMapLocation onClick={() => setMapMode(true)} size={"2em"} />
                        </IconMapWrapper>
                        <AdsWrapper>
                            {filteredAds?.length 
                                ?   filteredAds.map(ad => {
                                        return <SmallItem
                                                    key={ad._id}
                                                    name={ad.name}
                                                    price={ad.price}
                                                    address={ad.address}
                                                    picSrc={ad.pic}
                                                    _id={ad._id}
                                                />
                                    })
                                : <h3>Sorry, no ads match your query.</h3>
                            }
                        </AdsWrapper>
                    </List>

                </ListWrapper>
    )
}

const MapWrapper = styled.div`
    width: 100%;
    display: flex;
    position: relative;
`
const ListWrapper = styled.div`
    width: var(--content-width);
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 30px;
`
const AdsWrapper = styled.div`
    margin-top: 10px;
    width: var(--big-block-width);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    a {
        margin-left: 10px;
    }
`
const List = styled.div`
    display: flex;
    flex-direction: column;
`
const IconListWrapper = styled.div`
    position: absolute;
    left: calc(var(--small-block-width) + 20px);
    top: 10px;
    z-index: 2;
    width: 30px;
    height: 30px;
    padding: 7px 10px;
    background-color: var(--color-background-white);
    border-radius: 5px;
    -webkit-box-shadow: 0px 2px 8px -2px #000000; 
    box-shadow: 0px 2px 8px -2px #000000;
    svg {
        cursor: pointer;
        color: var(--color-button);
        &:hover {
            color: var(--color-button-hover);
        }
    }
`
const IconMapWrapper = styled.div`
    margin-left: 10px;
    z-index: 2;
    width: 30px;
    height: 30px;
    padding: 7px 10px;
    background-color: var(--color-background-white);
    border-radius: 5px;
    -webkit-box-shadow: 0px 2px 8px -2px #000000; 
    box-shadow: 0px 2px 8px -2px #000000;
    svg {
        cursor: pointer;
        path {
            stroke: var(--color-paragraph);
        }
        &:hover path {
            stroke: var(--color-button-hover);
        }
    }
`
export default Search;