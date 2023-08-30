import * as fs from "node:fs/promises";
import path from "node:path";

const EMOTES_DIRECTORY = "emotes";

fs.access(EMOTES_DIRECTORY).catch(() => {
    fs.mkdir(EMOTES_DIRECTORY);
}).finally(() => {
    json();
    css();
});

async function json() {
    const res = await fetch("https://cdn.destiny.gg/emotes/emotes.json");
    const json = await res.clone().json();
    images(json);
    const text = await res.text();
    fs.writeFile("./emotes.raw.json", text);
    fs.writeFile("./emotes.json", JSON.stringify(json, null, 4));
}

async function images(emotes) {
    for (const file of await fs.readdir("emotes")) await fs.unlink(path.join(EMOTES_DIRECTORY, file));
    emotes.forEach((emote) => emote.image.forEach(async (image) => {
        const res = await fetch(image.url);
        fs.writeFile(path.join(EMOTES_DIRECTORY, image.name), res.body);
    }));
}

async function css() {
    const res = await fetch("https://cdn.destiny.gg/emotes/emotes.css");
    const text = await res.text();
    fs.writeFile("./emotes.css", text);
}
