import React from "react";
import classes from "./Markers.module.scss";
import { Box, Button, Input, InputArea, Text } from "@wix/design-system";
import { Dismiss, Minus } from "@wix/wix-ui-icons-common";

const Markers = (props) => {
  return (
    <Box direction="vertical" className={classes.manage_markers_container}>
      <Box
        direction="horizontal"
        justifyContent="space-between"
        alignItems="center"
        className={classes.manage_markers_header}
      >
        <Text weight="bold" size="medium">
          Markers
        </Text>

        <Dismiss
          size="24px"
          onClick={() => props.handleMarkerManagerVisibility(false)}
        />
      </Box>
      <Box direction="vertical" gap="20px" className={classes.markers}>
        {props.markers.map((marker, index) => {
          return (
            <Box
              direction="vertical"
              className={classes.manage_marker_container}
              key={marker.id}
              gap="10px"
            >
              <Box
                alignItems="center"
                justifyContent="space-between"
                gap="10px"
                direction="horizontal"
                className={classes.positionContainer}
              >
                <Input
                  value={marker.value}
                  className={classes.marker_position_input}
                  onChange={(e) =>
                    props.handleInputChange(e, marker, index, "place")
                  }
                />

                <Minus
                  cursor="pointer"
                  onClick={() => props.handleDeleteMarker(marker, index)}
                />
              </Box>
              <InputArea
                value={marker.description}
                onFocus={() => {
                  props.handleMarkerClick(marker);
                }}
                onChange={(e) =>
                  props.handleInputChange(e, marker, index, "description")
                }
              />
            </Box>
          );
        })}
      </Box>
      <Box width="100%">
        <Button
          onClick={() => props.handleAddNewMarker()}
          size="small"
          className={classes.new_marker_button}
        >
          Add New Marker
        </Button>
      </Box>
    </Box>
  );
};

export default Markers;
