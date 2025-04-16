// components/Map/Map.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { setKey, fromLatLng, fromAddress } from "react-geocode";
import {
  Box,
  Button,
  Text,
  Page,
  EmptyState,
  Loader,
  Card,
  Input,
  InputArea,
  PopoverMenu,
  IconButton,
  AddItem,
} from "@wix/design-system";
import classes from "./Map.module.scss";
import {
  Compose,
  Delete,
  Dismiss,
  Location,
  More,
} from "@wix/wix-ui-icons-common";

// Constants
const MAP_API_KEY = "AIzaSyAnaT_v4wuB2p_9M2sbriWcIGD2gclaqAs";
setKey(MAP_API_KEY);

const LOCAL_KEYS = {
  markers: "map_markers",
  zoom: "map_zoom",
  centerLat: "map_center_lat",
  centerLng: "map_center_lng",
  mapType: "map_type",
};
const DEFAULT_CENTER = { lat: -22.908333, lng: -43.196388 };
const DEFAULT_ZOOM = 8;
const MAP_LIBRARIES = ["places"];
const MAP_CONTAINER_STYLE = { width: "100%", height: "100vh" };

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [mapType, setMapType] = useState("roadmap");
  const [isOpen, setIsOpen] = useState(false);

  const mapRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem(LOCAL_KEYS.markers));
    const savedZoom = localStorage.getItem(LOCAL_KEYS.zoom);
    const savedLat = localStorage.getItem(LOCAL_KEYS.centerLat);
    const savedLng = localStorage.getItem(LOCAL_KEYS.centerLng);
    const savedType = localStorage.getItem(LOCAL_KEYS.mapType);

    if (savedMarkers?.length) setMarkers(savedMarkers);
    if (savedZoom) setZoom(Number(savedZoom));
    if (savedLat && savedLng)
      setCenter({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
    if (savedType) setMapType(savedType);
  }, []);

  const persistState = (key, value) => {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  };

  const handleAddMarker = async () => {
    try {
      const response = await fromLatLng(center.lat, center.lng);
      const address = response.results[0].formatted_address;
      const newMarker = {
        id: Date.now(),
        value: address,
        description: "",
        position: center,
      };
      const updatedMarkers = [newMarker, ...markers];
      setMarkers(updatedMarkers);
      persistState(LOCAL_KEYS.markers, updatedMarkers);
    } catch (err) {
      console.error("Failed to geocode center:", err);
    }
  };

  const handleMarkerDrag = async (e, marker, index) => {
    try {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const response = await fromLatLng(lat, lng);
      const address = response.results[0].formatted_address;

      const updated = [...markers];
      updated[index] = {
        ...updated[index],
        value: address,
        position: { lat, lng },
      };
      setMarkers(updated);
      persistState(LOCAL_KEYS.markers, updated);
      console.log(updated);
    } catch (err) {
      console.error("Failed to update marker:", err);
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setCenter(marker.position);
    persistState(LOCAL_KEYS.centerLat, marker.position.lat);
    persistState(LOCAL_KEYS.centerLng, marker.position.lng);
  };

  const handleDeleteMarker = (id) => {
    const filtered = markers.filter((m) => m.id !== id);
    setMarkers(filtered);
    setSelectedMarker(null);
    persistState(LOCAL_KEYS.markers, filtered);
  };

  const handleDescriptionChange = (e, markerId) => {
    const value = e.target.value;
    const updated = markers.map((m) =>
      m.id === markerId ? { ...m, description: value } : m
    );
    setMarkers(updated);
    persistState(LOCAL_KEYS.markers, updated);
    if (selectedMarker?.id === markerId) {
      setSelectedMarker({ ...selectedMarker, description: value });
    }
  };

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleMapChange = () => {
    if (!mapRef.current) return;
    const { lat, lng } = mapRef.current.getCenter().toJSON();
    const currentZoom = mapRef.current.getZoom();
    const currentType = mapRef.current.getMapTypeId();

    setCenter({ lat, lng });
    setZoom(currentZoom);
    setMapType(currentType);

    persistState(LOCAL_KEYS.centerLat, lat);
    persistState(LOCAL_KEYS.centerLng, lng);
    persistState(LOCAL_KEYS.zoom, currentZoom);
    persistState(LOCAL_KEYS.mapType, currentType);
  };

  const handleInputChange = (e, markerId) => {
    const value = e.target.value;
    const updated = markers.map((m) =>
      m.id === markerId ? { ...m, value } : m
    );
    setMarkers(updated);
  };

  const handleAddressUpdate = async (markerId, address) => {
    try {
      const response = await fromAddress(address);
      const location = response.results[0].geometry.location;

      const updatedMarkers = markers.map((marker) =>
        marker.id === markerId
          ? {
              ...marker,
              value: address,
              position: { lat: location.lat, lng: location.lng },
            }
          : marker
      );

      setMarkers(updatedMarkers);
      persistState(LOCAL_KEYS.markers, updatedMarkers);

      if (selectedMarker?.id === markerId) {
        setSelectedMarker({
          ...selectedMarker,
          value: address,
          position: { lat: location.lat, lng: location.lng },
        });
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };
  const renderMapContent = () => (
    <>
      <Button
        onClick={handleAddMarker}
        size="small"
        className={classes.add_marker_btn}
      >
        Add Marker
      </Button>
      <Button
        onClick={() => setIsOpen(true)}
        size="small"
        className={classes.manage_markers_btn}
      >
        Manage Markers
      </Button>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={zoom}
        mapTypeId={mapType}
        onLoad={handleMapLoad}
        onDragEnd={handleMapChange}
        onZoomChanged={handleMapChange}
        onMapTypeIdChanged={handleMapChange}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable
            onClick={() => handleMarkerClick(marker)}
            onDragEnd={(e) => handleMarkerDrag(e, marker, index)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -40),
            }}
          >
            <Box direction="vertical" gap="6px" width="200px">
              <Text weight="bold">{selectedMarker.description}</Text>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      <Box
        className={classes.markers_side_panel}
        style={{
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Card.Header
          title="Markers"
          suffix={<Dismiss onClick={() => setIsOpen(false)} />}
        />
        <Card.Divider />
        <Box direction="vertical" gap="20px" className={classes.markers_list}>
          {markers.length > 0 ? (
            markers.map((marker, index) => (
              <Box direction="vertical" gap="20px" key={marker.id}>
                <Box direction="vertical" gap="6px">
                  <Box
                    width="100%"
                    direction="horizontal"
                    alignItems="center"
                    justifyContent="space-between"
                    alignSelf="flex-end"
                  >
                    <Text>Marker {index + 1}</Text>
                    <PopoverMenu
                      triggerElement={
                        <IconButton priority="secondary" size="small">
                          <More />
                        </IconButton>
                      }
                      size="small"
                      appendTo="window"
                    >
                      <PopoverMenu.MenuItem
                        text="Delete"
                        skin="destructive"
                        onClick={() => handleDeleteMarker(marker.id)}
                        prefixIcon={<Delete />}
                      />
                    </PopoverMenu>
                  </Box>
                  <Input
                    value={marker.value}
                    placeholder="Location"
                    onChange={(e) => handleInputChange(e, marker.id)}
                    onBlur={(e) =>
                      handleAddressUpdate(marker.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddressUpdate(marker.id, e.target.value);
                      }
                    }}
                    prefix={
                      <Input.Affix>
                        <Location />
                      </Input.Affix>
                    }
                  />
                  <Input
                    value={marker.description}
                    placeholder="Description"
                    onFocus={() => handleMarkerClick(marker)}
                    onChange={(e) => handleDescriptionChange(e, marker.id)}
                    prefix={
                      <Input.Affix>
                        <Compose />
                      </Input.Affix>
                    }
                  />
                </Box>
                <Card.Divider />
              </Box>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>There are no markers yet</Text>
            </div>
          )}
        </Box>
        <Box padding="15px 20px">
          <AddItem size="tiny" onClick={() => handleAddMarker()} />
        </Box>
      </Box>
    </>
  );

  const renderPage = (children) => (
    <Page className={classes.map_page}>
      <Page.Header title="Interactive Map" />
      <Page.Content>{children}</Page.Content>
    </Page>
  );

  if (loadError) {
    return renderPage(
      <EmptyState
        className={classes.map_empty_state}
        title="Failed to Load Map"
        subtitle="Check your internet or API key."
      />
    );
  }

  if (!isLoaded) {
    return renderPage(
      <Box className={classes.map_loader}>
        <Loader statusMessage="Loading map..." />
      </Box>
    );
  }

  return <>{renderMapContent()}</>;
};

export default Map;
