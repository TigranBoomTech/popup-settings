const config = {
    root: {
        type: "EmailLayout",
        data: {
            backdropColor: "#ffffff",
            canvasColor: "#FFFFFF",
            textColor: "#262626",
            fontFamily: "MODERN_SANS",
            childrenIds: ["block-1742902369295", "block-1742902371424"],
        },
    },
    "block-1742902369295": {
        type: "Text",
        data: {
            style: {
                fontSize: 30,
                fontWeight: "normal",
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: "{Form Name}",
            },
        },
    },
    "block-1742902371424": {
        type: "Text",
        data: {
            style: {
                fontSize: 22,
                fontWeight: "normal",
                padding: {
                    top: 16,
                    bottom: 16,
                    right: 24,
                    left: 24,
                },
            },
            props: {
                text: "{All Entries}",
            },
        },
    },
};

export default config;
