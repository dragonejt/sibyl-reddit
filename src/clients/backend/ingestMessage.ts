export default async function ingestMessage(message: object) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/psychopass/message`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) return response.status
    } catch (error) {
        console.error(error);
    }
}