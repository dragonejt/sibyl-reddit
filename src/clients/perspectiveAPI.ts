import { google } from "googleapis";
const perspectiveAPI = await google.discoverAPI("https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1");

export const analyzeComment = async (comment: string) => {
    try {
        const response = await (perspectiveAPI.comments as any).analyze({
            key: process.env.PERSPECTIVE_API_KEY,
            resource: {
                comment: {
                    text: comment
                },
                requestedAttributes: {
                    TOXICITY: {},
                    SEVERE_TOXICITY: {},
                    IDENTITY_ATTACK: {},
                    INSULT: {},
                    PROFANITY: {},
                    THREAT: {},
                    SEXUALLY_EXPLICIT: {}
                },
                languages: ["en"]
            }
        });
        return response
    } catch (error) {
        console.error(error);
    }
}
