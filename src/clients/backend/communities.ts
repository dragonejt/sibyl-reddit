import env from "../../env.js";

type Community = {
    id: number
    platform: number
    community_id: string
    discord_log_channel: string | null
    discord_notify_target: string | null
};

class Communities {
    url: string;
    constructor(url = `${env.BACKEND_URL}/community`) {
        this.url = url;
    }

    async read(communityID: string): Promise<Community | undefined> {
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

    async create(communityID: string): Promise<Community | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "sibyl-reddit Devvit",
                    "Authorization": `Token ${env.BACKEND_API_KEY}`
                },
                body: JSON.stringify({ communityID })
            });
            if (!response.ok) throw new Error(`POST ${this.url}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async update(data: Partial<Community>): Promise<Community | undefined> {
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

export default new Communities();
