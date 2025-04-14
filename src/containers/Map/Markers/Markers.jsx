import React from "react";
import classes from "./Markers.module.scss";
import {
  AddItem,
  Box,
  Button,
  Card,
  IconButton,
  Input,
  InputArea,
  PopoverMenu,
  Text,
} from "@wix/design-system";
import { Delete, Dismiss, Minus, More } from "@wix/wix-ui-icons-common";

const Markers = ({
  markers,
  handleAddNewMarker,
  handleDeleteMarker,
  handleInputChange,
  handleMarkerClick,
}) => {
  return (
    <Box direction="vertical" className={classes.manage_markers_container}>
      <Box direction="vertical" gap="20px" className={classes.markers}>
        {markers.map((marker, index) => {
          return (
            <Box
              key={marker.id}
              border="1px dashed #5999FF"
              borderRadius="12px"
              padding="16px"
              marginBottom="12px"
              backgroundColor="white"
              flexDirection="column"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="8px"
              >
                <Box fontSize="18px" fontWeight="bold">
                  <Text>{`Marker ${index + 1}`}</Text>
                </Box>
                <PopoverMenu
                  textSize="small"
                  triggerElement={
                    <IconButton priority="secondary" size="small">
                      <More />
                    </IconButton>
                  }
                >
                  <PopoverMenu.MenuItem
                    skin="destructive"
                    text="Delete"
                    prefixIcon={<Delete />}
                    onClick={() => handleDeleteMarker(marker, index)}
                  />
                </PopoverMenu>
              </Box>

              <Box display="flex" flexDirection="column" gap="12px">
                <Input
                  size="small"
                  placeholder="Place"
                  value={marker.value}
                  onChange={(e) => handleInputChange(e, marker, index, "place")}
                />
                <InputArea
                  size="small"
                  placeholder="Location description"
                  value={marker.description}
                  onFocus={() => {
                    handleMarkerClick(marker);
                  }}
                  onChange={(e) =>
                    handleInputChange(e, marker, index, "description")
                  }
                />
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box marginTop="20px">
        <AddItem onClick={() => handleAddNewMarker()} />
      </Box>
    </Box>
  );
};

export default Markers;
