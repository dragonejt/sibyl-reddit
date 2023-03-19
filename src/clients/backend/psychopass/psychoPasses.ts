class PsychoPasses {
    url;
    constructor(url = `${process.env.BACKEND_URL}/psychopass/user`) {
        this.url = url;
    }

    async get(userID: string) {
        try {
            const response = await fetch(`${this.url}?id=${userID}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                    "Authorization": `Token ${process.env.BACKEND_API_KEY}`
                }
            });
            if (!response.ok) throw new Error(`GET ${this.url}?id=${userID}: ${response.status} ${response.statusText}`);
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }
}

const psychoPasses = new PsychoPasses();
export default psychoPasses;