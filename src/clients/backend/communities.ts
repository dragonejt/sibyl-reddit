import env from "../../env.js";

interface Community {
    id: number
    platform: number
    community_id: string
    communityID?: string
    discord_log_channel?: string
    discord_notify_target?: string
}

export default class Communities {
    static url = `${env.BACKEND_URL!}/community`;

    static async create(communityID: string): Promise<Community | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": `sibyl-reddit`,
                    "Authorization": `Token ${env.BACKEND_API_KEY!}`
                },
                body: JSON.stringify({ communityID })
            });
            if (!response.ok) throw new Error(`POST ${this.url}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    static async read(communityID: string): Promise<Community | undefined> {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "User-Agent": `sibyl-reddit`,
                    "Authorization": `Token ${env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    static async update(data: Partial<Community>): Promise<Community | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": `sibyl-reddit`,
                    "Authorization": `Token ${env.BACKEND_API_KEY!}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`PUT ${this.url}: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    static async delete(communityID: string) {
        try {
            const response = await fetch(`${this.url}?id=${communityID}`, {
                method: "DELETE",
                headers: {
                    "User-Agent": `sibyl-reddit`,
                    "Authorization": `Token ${env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`DELETE ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(error);
        }
    }
}