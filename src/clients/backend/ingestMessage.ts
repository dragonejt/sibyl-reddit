import { KeyValueStorage } from "@devvit/public-api";
import { MessageAnalysis } from "../perspectiveAPI.js";

const kvstore = new KeyValueStorage();

export default async function ingestMessage(message: MessageAnalysis) {
    try {
        const response = await fetch(`${kvstore.get("BACKEND_URL")}/psychopass/message`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "User-Agent": `sibyl-discord/${process.env.npm_package_version} node.js/${process.version}`,
                "Authorization": `Token ${process.env.BACKEND_API_KEY}`
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) throw new Error(`Ingest Message: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.error(error);
    }
}