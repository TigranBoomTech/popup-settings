//libraries
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { setKey, fromLatLng, fromAddress } from "react-geocode";
import { getParameterByName } from "../../helpers/common";
import Markers from "./Markers/Markers";
import { Button, Text } from "@wix/design-system";
import classes from "./Map.module.scss";

const libraries = ["places"];

const mapStyles = {
  width: "100%",
  height: "100vh",
};

const Map = () => {
  const [markers, setMarkers] = useState([
    {
      id: 1,
      value: "Rio de Janeiro",
      description: "Dream City",
      position: { lat: -22.908333, lng: -43.196388 },
    },
  ]);
  const [zoom, setZoom] = useState(8);
  const [center, setCenter] = useState({ lat: -22.908333, lng: -43.196388 });
  const [mapType, setMapType] = useState("roadmap");
  const [selected, setSelected] = useState(null);
  const [isMarkersManagerOpen, setIsMarkersManagerOpen] = useState(false);

  useEffect(() => {
    let defaultMarkerValues = JSON.parse(getParameterByName("markers"));
    let myzoom = localStorage.getItem("zoom");
    let mymapType = localStorage.getItem("mapTypeId");
    let mycLat = localStorage.getItem("cLat");
    let mycLng = localStorage.getItem("cLng");

    myzoom ? setZoom(Number(myzoom)) : localStorage.setItem("zoom", zoom);
    mymapType
      ? setMapType(mymapType)
      : localStorage.setItem("mapTypeId", mapType);
    mycLat && mycLng
      ? setCenter({ lat: parseFloat(mycLat), lng: parseFloat(mycLng) })
      : (localStorage.setItem("cLat", center.lat),
        localStorage.setItem("cLng", center.lng));
    if (defaultMarkerValues && defaultMarkerValues.length) {
      if (!mycLat && !mycLng) {
        let newCenter = {
          lat: defaultMarkerValues[0].position.lat,
          lng: defaultMarkerValues[0].position.lng,
        };
        setCenter(newCenter);
        localStorage.setItem("cLat", newCenter.lat);
        localStorage.setItem("cLng", newCenter.lng);
      }
      setMarkers(defaultMarkerValues);
      localStorage.setItem("markers", JSON.stringify(defaultMarkerValues));
    } else {
      localStorage.setItem("markers", JSON.stringify(markers));
    }
  }, []);

  // useEffect(() => {
  //   Wix.Data.Public.set(
  //     "startCounter",
  //     {
  //       markers,
  //       mapType,
  //       zoom,
  //       center,
  //     },
  //     { scope: "COMPONENT" }
  //   );
  // }, [markers, center, zoom, center]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnaT_v4wuB2p_9M2sbriWcIGD2gclaqAs",
    libraries,
  });

  setKey("AIzaSyAnaT_v4wuB2p_9M2sbriWcIGD2gclaqAs");
  const mapRef = useRef();
  const mapCenterText = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const handleMarkerDragEnd = (e, marker, index) => {
    let newMarkers = [...markers];
    let newMarker = { ...marker };
    fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      (response) => {
        const address = response.results[0].formatted_address;
        newMarker = {
          ...newMarker,
          value: address,
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
        };
        newMarkers.splice(index, 1, newMarker);
        setMarkers(newMarkers);
        localStorage.setItem("markers", JSON.stringify(newMarkers));
        if (selected && selected.id === marker.id) {
          setSelected(newMarker);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleAddNewMarker = () => {
    const index = Date.now();
    fromLatLng(center.lat, center.lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let newMarker = {
          id: index,
          value: address,
          description: "",
          position: center,
        };
        let newMarkers = [newMarker, ...markers];
        setMarkers(newMarkers);
        localStorage.setItem("markers", JSON.stringify(newMarkers));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleDeleteMarker = (item, index) => {
    let newMarkers = [...markers];
    newMarkers.splice(index, 1);
    if (selected && selected.id === item.id) {
      setSelected(null);
    }
    setMarkers(newMarkers);
    localStorage.setItem("markers", JSON.stringify(newMarkers));
  };

  const handleInputChange = (e, item, index, field) => {
    const value = e.target.value;
    switch (field) {
      case "description":
        let markersForDescr = [...markers];
        markersForDescr[index] = {
          ...markersForDescr[index],
          description: value,
        };
        setSelected((selected) => {
          return { ...selected, description: value };
        });
        setMarkers(markersForDescr);
        localStorage.setItem("markers", JSON.stringify(markersForDescr));
        break;
      case "place":
        let markersForPlace = [...markers];
        markersForPlace[index] = { ...markersForPlace[index], value: value };
        setMarkers(markersForPlace);
        localStorage.setItem("markers", JSON.stringify(markersForPlace));
        break;
      default:
        console.log("default case");
        break;
    }
  };

  const handleMarkerManagerVisibility = (visible) => {
    setIsMarkersManagerOpen(visible);
  };

  const handleMapDragEnd = () => {
    mapCenterText.current.style.display = "none";
    if (mapRef.current && mapRef.current.center) {
      let lat = mapRef.current.center.lat();
      let lng = mapRef.current.center.lng();
      localStorage.setItem("cLat", lat), localStorage.setItem("cLng", lng);
      setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
    }
  };

  const handleMapDragStart = () => {
    mapCenterText.current.style.display = "block";
  };

  const handleMarkerClick = (marker) => {
    setSelected(marker);
    localStorage.setItem("cLat", marker.position.lat),
      localStorage.setItem("cLng", marker.position.lng);
    setCenter(marker.position);
  };

  const handleZoomChange = () => {
    if (mapRef && mapRef.current) {
      let newZoom = mapRef.current.zoom;
      localStorage.setItem("zoom", newZoom);
      setZoom(newZoom);
    }
  };

  const handlekeyPress = (e) => {
    if (
      e &&
      e.key === "Enter" &&
      isMarkersManagerOpen &&
      e.target.type == "text"
    ) {
      let newMarkers = [...markers];
      let value = e.target.value;
      let newMarkerIndex = newMarkers.findIndex(
        (marker) => marker.value == value
      );
      fromAddress(value).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          let newMarker = {
            ...newMarkers[newMarkerIndex],
            position: { lat, lng },
          };
          newMarkers.splice(newMarkerIndex, 1, newMarker);
          setMarkers(newMarkers);
          localStorage.setItem("markers", JSON.stringify(newMarkers));
          setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
          localStorage.setItem("cLat", lat);
          localStorage.setItem("cLng", lng);
          if (selected) {
            setSelected(newMarker);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  };

  const handleMapTypeIdChange = () => {
    if (mapRef && mapRef.current) {
      let newMapType = mapRef.current.mapTypeId;
      localStorage.setItem("mapTypeId", newMapType);
      setMapType(newMapType);
    }
  };

  return (
    <div className={classes.map} onKeyUp={(e) => handlekeyPress(e)}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={zoom}
        center={center}
        mapTypeId={mapType}
        onLoad={onMapLoad}
        onDragStart={handleMapDragStart}
        onDragEnd={handleMapDragEnd}
        onZoomChanged={handleZoomChange}
        onMapTypeIdChanged={handleMapTypeIdChange}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable={true}
            onClick={() => handleMarkerClick(marker)}
            onDragEnd={(e) => handleMarkerDragEnd(e, marker, index)}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{
              lat: selected.position.lat,
              lng: selected.position.lng,
            }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <Text>
              <p>{selected.description}</p>
            </Text>
          </InfoWindow>
        ) : null}
      </GoogleMap>
      {isMarkersManagerOpen ? (
        <Markers
          markers={markers}
          handleAddNewMarker={handleAddNewMarker}
          handleDeleteMarker={handleDeleteMarker}
          handleInputChange={handleInputChange}
          handleMarkerManagerVisibility={handleMarkerManagerVisibility}
          handleMarkerClick={handleMarkerClick}
        />
      ) : null}
      <Button
        className={classes.manageMarkersButton}
        onClick={() => handleMarkerManagerVisibility(true)}
        size="small"
      >
        Manage Markers
      </Button>
      <div ref={mapCenterText} className={classes.showCenter}>
        <Text size="medium" weight="bold">
          It Will Be Your Map Center
        </Text>
      </div>
    </div>
  );
};

export default Map;
