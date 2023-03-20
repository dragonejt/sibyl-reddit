export type MessageDominator = {
    id: number,
    profile: number,
    discord_log_channel: string | null,
    discord_notify_target: string | null,

    toxicity_action: number,
    toxicity_threshold: number,
    severe_toxicity_action: number,
    severe_toxicity_threshold: number,
    identity_attack_action: number,
    identity_attack_threshold: number,
    insult_action: number,
    insult_threshold: number,
    threat_action: number,
    threat_threshold: number,
    profanity_action: number,
    profanity_threshold: number,
    sexually_explicit_action: number,
    sexually_explicit_threshold: number
}

class MessageDominators {
    url: string;
    constructor(url = `${process.env.BACKEND_URL}/dominator/message`) {
        this.url = url;
    }

    async get(communityID: string): Promise<MessageDominator | undefined> {
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

    async update(data: Partial<MessageDominator>) {
        try {
            const response = await fetch(this.url, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`PUT ${this.url}: ${response.status} ${response.statusText}`);
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

export const messageDominators = new MessageDominators();