import { MessageAnalysis } from "../perspectiveAPI.js";

export default async function ingestMessage(message: MessageAnalysis) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL!}/psychopass/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `${process.env.npm_package_name}/${process.env.npm_package_version!} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY!}`
            },
            body: JSON.stringify(message)
        });
        if (!response.ok) throw new Error(`Ingest Message: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.error(error);
    }
}
