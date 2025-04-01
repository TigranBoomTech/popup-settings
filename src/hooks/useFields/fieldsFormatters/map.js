import { getFieldClassnames, getFieldInstruction, getFieldLabel, getFieldWidth } from "../helpers";

export const map = ({ field }) => {
    const { id, lat, lng, mapType, markers, zoom, height } = field;
    const formatedField = {
        type: "map",
        id,
        apiKey: "AIzaSyAnaT_v4wuB2p_9M2sbriWcIGD2gclaqAs",
        lat,
        lng,
        mapType,
        markers,
        zoom: parseInt(zoom),
        height,
        classnameprefix: getFieldClassnames(field),
        instruction: getFieldInstruction(field),
        width: getFieldWidth(field),
        ...getFieldLabel(field),
    };

    return formatedField;
};
