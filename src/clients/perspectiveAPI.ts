import env from "../env.js"

type AttributeScore = {
    summaryScore: {
        value: number
        type: string
    }
};

export type AttributeScores = {
    TOXICITY: AttributeScore
    SEVERE_TOXICITY: AttributeScore
    IDENTITY_ATTACK: AttributeScore
    INSULT: AttributeScore
    THREAT: AttributeScore
    PROFANITY: AttributeScore
    SEXUALLY_EXPLICIT: AttributeScore
}

export type MessageAnalysis = {
    attributeScores: AttributeScores
    languages: string[]
    clientToken?: string
    userID?: string
    communityID?: string
};

export async function analyzeComment(comment: string): Promise<MessageAnalysis | undefined> {
    try {
        const response = await fetch(
            `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${env.PERSPECTIVE_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
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
                    languages: ["en"],
                    clientToken: "sibyl-reddit"
                })
            });
        if (!response.ok) throw new Error(`Perspective API Analyze Comment:  ${response.status} ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function suggestCommentScore(comment: string, attributeScores: Partial<AttributeScores>): Promise<MessageAnalysis | undefined> {
    try {
        const response = await fetch(
            `https://commentanalyzer.googleapis.com/v1alpha1/comments:suggestscore?key=${env.PERSPECTIVE_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comment: {
                        text: comment
                    },
                    attributeScores,
                    languages: ["en"],
                    clientToken: "sibyl-reddit"
                })
            });
        if (!response.ok) throw new Error(`Perspective API Suggest Comment Score:  ${response.status} ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
