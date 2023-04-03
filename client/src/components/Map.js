import styled from "styled-components";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, MarkerClusterer} from "@react-google-maps/api";
import { smallAdsArr } from "../data";

const Map = () => {
    const center = useMemo(() => ({lat: 45.5, lng: -73.5}), []);
    const options = useMemo(() => ({disableDefaultUI: true, clickableIcons: false}), []);
    const mapRef = useRef();
    const [ads, setAds] = useState(null);

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    useEffect(() => {
        setAds(smallAdsArr);
    }, []);

    const handleMarkerClick = (adId) => {
        const clickedAd = ads.find(ad => ad._id === adId);
        console.log("marker: ", clickedAd);
    }
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
                                    onClick={() => handleMarkerClick(ad._id)}
                                />
                    })}

                </MarkerClusterer>}
            </GoogleMap>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    .map-container {
        width: 100%;
        height: 100vh;
    }
`
export default Map;