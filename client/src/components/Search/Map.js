import styled from "styled-components";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, MarkerClusterer, InfoWindow} from "@react-google-maps/api";

import SmallItem from "../shared/SmallItem";

// component for showing Google Map with ads clusters and markers
const Map = ({filteredAds}) => {
    // saving center of the map
    const center = useMemo(() => ({lat: 45.5, lng: -73.6}), []);
    const options = useMemo(() => ({disableDefaultUI: true, clickableIcons: false}), []);
    const mapRef = useRef();
    // selected ad (user clicked on ad's marker)
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    useEffect(() => {
        setLoading(true);
    }, [])

    return (
        <Wrapper>
            <GoogleMap 
                zoom={11}
                center={center}
                mapContainerClassName="map-container"
                options={options}
                onLoad={onLoad}
            >
                {loading && <MarkerClusterer>
                    {(clusterer) => filteredAds.map(ad => {
                        return <Marker 
                                    key={ad._id}
                                    position={{lat: Number(ad.location.coordinates[0]), lng: Number(ad.location.coordinates[1])}}
                                    clusterer={clusterer}
                                    onClick={() => setSelected(ad)}
                                />
                    })}

                </MarkerClusterer>}
                {selected 
                    // displaying selected ad info on map
                    ?   <InfoWindow 
                            position={{lat: Number(selected.location.coordinates[0]), lng: Number(selected.location.coordinates[1])}}
                            onCloseClick={() => setSelected(null)}
                        >
                            <SmallItem 
                                name={selected.name}
                                price={selected.price}
                                picSrc={selected.pic}
                                address={selected.address}
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