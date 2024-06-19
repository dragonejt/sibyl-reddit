import { SettingsFormField } from "@devvit/public-api";

const settings: SettingsFormField[] = [
    {
        name: "BACKEND_URL",
        label: "URL for the Backend API",
        type: "string",
        isSecret: false,
        scope: "app",
    },
    {
        name: "BACKEND_API_KEY",
        label: "API Key for the Backend API",
        type: "string",
        isSecret: true,
        scope: "app",
    },
    {
        name: "PERSPECTIVE_API_KEY",
        label: "API Key for the Perspective API",
        type: "string",
        isSecret: true,
        scope: "app",
    },
];

export default settings;
