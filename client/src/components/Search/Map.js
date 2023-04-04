import styled from "styled-components";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, MarkerClusterer, InfoWindow} from "@react-google-maps/api";
import { smallAdsArr } from "../../data";

import SmallItem from "../shared/SmallItem";

const Map = () => {
    const center = useMemo(() => ({lat: 45.5, lng: -73.5}), []);
    const options = useMemo(() => ({disableDefaultUI: true, clickableIcons: false}), []);
    const mapRef = useRef();
    const [ads, setAds] = useState(null);
    const [selected, setSelected] = useState(null);
    console.log("sel: ", selected);

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    useEffect(() => {
        setAds(smallAdsArr);
    }, []);

    return (
        <Wrapper>
            <GoogleMap 
                zoom={10}
                center={center}
                mapContainerClassName="map-container"
                options={options}
                onLoad={onLoad}
            >
                {ads && <MarkerClusterer>
                    {(clusterer) => ads.map(ad => {
                        return <Marker 
                                    key={ad._id}
                                    position={{lat: Number(ad.location.coordinates[0]), lng: Number(ad.location.coordinates[1])}}
                                    clusterer={clusterer}
                                    onClick={() => setSelected(ad)}
                                />
                    })}

                </MarkerClusterer>}
                {selected 
                    ?   <InfoWindow 
                            position={{lat: Number(selected.location.coordinates[0]), lng: Number(selected.location.coordinates[1])}}
                            onCloseClick={() => setSelected(null)}
                        >
                            <SmallItem 
                                name={selected.name}
                                price={selected.price}
                                picSrc={selected.picSrc}
                                _id={selected._id}
                            />
                        </InfoWindow>
                    :   null}
            </GoogleMap>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: calc(100% - var(--small-block-width));
    height: 100vh;
    .map-container {
        width: 100%;
        height: 100vh;
    }
`
export default Map;