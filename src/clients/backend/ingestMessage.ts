import { MessageAnalysis } from "../perspectiveAPI.js";
import env from "../../env.js";

export default async function ingestMessage(message: MessageAnalysis) {
    try {
        const response = await fetch(`${env.BACKEND_URL!}/psychopass/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": `sibyl-reddit node.js`,
                "Authorization": `Token ${env.BACKEND_API_KEY!}`
            },
            body: JSON.stringify(message)
        });
        if (!response.ok) throw new Error(`Ingest Message: ${response.status} ${response.statusText}`);
    } catch (error) {
        console.error(error);
    }
}
