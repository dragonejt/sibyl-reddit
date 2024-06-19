import env from "../../../env.js";

export interface CommunityPsychoPass {
    id: number;
    community: number;
    users: number[];

    area_stress_level: {
        toxicity: number;
        severe_toxicity: number;
        identity_attack: number;
        insult: number;
        threat: number;
        profanity: number;
        sexually_explicit: number;
    };
}

export class CommunityPsychoPasses {
    static url = `${env.BACKEND_URL!}/psychopass/community`;

    static async read(
        communityID: string
    ): Promise<CommunityPsychoPass | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "User-Agent": `sibyl-reddit`,
                    Authorization: `Token ${env.BACKEND_API_KEY!}`,
                },
            });
            if (!response.ok)
                throw new Error(
                    `GET ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`
                );
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    // For Removing a User Psycho-Pass from a Community Psycho-Pass Only
    static async update(
        communityID: string,
        userID: string
    ): Promise<CommunityPsychoPass | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": `sibyl-reddit`,
                    Authorization: `Token ${env.BACKEND_API_KEY!}`,
                },
                body: JSON.stringify({ communityID, userID }),
            });
            if (!response.ok)
                throw new Error(
                    `PUT ${this.url}: ${response.status} ${response.statusText}`
                );
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}
