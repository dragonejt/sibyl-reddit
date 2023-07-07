import env from "../../../env.js";

export type MemberDominator = {
    id: number
    community: number
    communityID: string | null

    crime_coefficient_100_action: number
    crime_coefficient_300_action: number
    toxicity_action: number
    toxicity_threshold: number
    severe_toxicity_action: number
    severe_toxicity_threshold: number
    identity_attack_action: number
    identity_attack_threshold: number
    insult_action: number
    insult_threshold: number
    threat_action: number
    threat_threshold: number
    profanity_action: number
    profanity_threshold: number
    sexually_explicit_action: number
    sexually_explicit_threshold: number
};

class MemberDominators {
    url = `${env.BACKEND_URL}/dominator/member`;

    async read(communityID: string): Promise<MemberDominator | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "sibyl-reddit Devvit",
                    "Authorization": `Token ${env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async update(data: Partial<MemberDominator>): Promise<MemberDominator | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "sibyl-reddit Devvit",
                    "Authorization": `Token ${env.BACKEND_API_KEY}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`PUT ${this.url}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async delete(communityID: string) {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "DELETE",
                headers: {
                    "User-Agent": "sibyl-reddit Devvit",
                    "Authorization": `Token ${env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`DELETE ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(error);
        }
    }
}

export const memberDominators = new MemberDominators();
