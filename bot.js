const fetch = require('node-fetch');
const fs = require('fs').promises;
const colors = require('colors');

const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    "connection": "keep-alive",
    "host": "clipapp1.com",
    "referer": "",
    "sec-ch-ua": '"Microsoft Edge";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-fetch-storage-access": "active",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
};

let requestCount = 0;

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function sendRequest(id, retryCount = 3) {
    const url = `https://clipapp1.com/seen?id=${id}`;
    headers.referer = `https://clipapp1.com/?id=${id}`;
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            const response = await fetch(url, { headers, timeout: 10000 });
            requestCount++;
            console.log(colors.green(`Request ${requestCount} sent for ID: ${id} | Utaa X sentinel Discuss`));
            return;
        } catch (e) {
            console.log(colors.red(`Error for ID: ${id} (Attempt ${attempt}/${retryCount}): ${e.message} | Utaa X sentinel Discuss`));
            if (attempt < retryCount) await delay(2000);
        }
    }
    console.log(colors.red(`Failed for ID: ${id} after ${retryCount} attempts | Utaa X sentinel Discuss`));
    await delay(2000);
}

async function main() {
    try {
        const data = await fs.readFile('Id.txt', 'utf8');
        const ids = data.split('\n').map(line => line.trim()).filter(line => line);
        if (!ids.length) {
            console.log(colors.red('No IDs found in Id.txt | Utaa X sentinel Discuss'));
            return;
        }
        console.log(colors.cyan(`Loaded ${ids.length} IDs | Utaa X sentinel Discuss`));
        console.log(colors.yellow('Utaa X sentinel Discuss'));
        while (true) {
            for (const id of ids) {
                await sendRequest(id);
                await delay(1000);
            }
            console.log(colors.yellow(`Total requests: ${requestCount} | Utaa X sentinel Discuss`));
        }
    } catch (e) {
        console.log(colors.red(`Error: ${e.message} | Utaa X sentinel Discuss`));
    }
}

process.on('SIGINT', () => {
    console.log(colors.red('\nStopping... | Utaa X sentinel Discuss'));
    process.exit(0);
});

main();
