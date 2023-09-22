interface Community {
    id: number
    platform: number
    community_id: string
    discord_log_channel: string | null
    discord_notify_target: string | null
}

export default class Communities {
    static url = `${process.env.BACKEND_URL!}/community`;

    static async create(communityID: string): Promise<Community | undefined> {
        try {
            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
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
                    "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
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
                    "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
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
                    "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
                }
            });
            if (!response.ok) throw new Error(`DELETE ${this.url}?id=${communityID}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(error);
        }
    }
}