export type CommunityPsychoPass = {
    id: number,
    platform: string,
    platform_id: string,
    users: Array<number>,

    area_stress_level: {
        toxicity: number,
        severe_toxicity: number,
        identity_attack: number,
        insult: number,
        threat: number,
        profanity: number,
        sexually_explicit: string
    }
}

class CommunityPsychoPasses {
    url: string;
    constructor(url = `${process.env.BACKEND_URL}/psychopass/community`) {
        this.url = url;
    }

    async get(communityID: string): Promise<CommunityPsychoPass | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async create(communityID: string) {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                },
                body: JSON.stringify({ communityID })
            });
            if (!response.ok) throw new Error(`POST ${this.url}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(error);
        }
    }

    async delete(communityID: string) {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`DELETE ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(error);
        }
    }

}

export const communityPsychoPasses = new CommunityPsychoPasses();
