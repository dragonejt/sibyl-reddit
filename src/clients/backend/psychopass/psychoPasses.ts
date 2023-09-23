import env from "../../../env.js";

export interface PsychoPass {
    id: number
    platform: number
    user_id: string
    messages: number
    psycho_hazard: boolean

    toxicity: number
    severe_toxicity: number
    identity_attack: number
    insult: number
    threat: number
    profanity: number
    sexually_explicit: number
    crime_coefficient: number
    hue: string
}

export class PsychoPasses {
    static url = `${env.BACKEND_URL!}/psychopass/user`;

    static async read(userID: string): Promise<PsychoPass | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${userID}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": `sibyl-reddit`,
                    "Authorization": `Token ${env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${userID}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}