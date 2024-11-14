import * as fs from "node:fs/promises";
import path from "node:path";

["emotes", "flairs"].forEach((type) => {
    fs.access(type).catch(() => {
        fs.mkdir(type);
    }).finally(() => {
        json(type);
        css(type);
    });
});

async function json(type) {
    const res = await fetch(`https://cdn.destiny.gg/${type}/${type}.json`);
    const json = await res.clone().json();
    images(json, type);
    const text = await res.text();
    fs.writeFile(`./${type}.raw.json`, text);
    fs.writeFile(`./${type}.json`, JSON.stringify(json, null, 4));
}

async function images(list, type) {
    for (const file of await fs.readdir(type)) await fs.unlink(path.join(type, file));
    list.forEach((element) => element.image.forEach(async (image) => {
        const res = await fetch(image.url);
        fs.writeFile(path.join(type, image.name), res.body);
    }));
}

async function css(type) {
    const res = await fetch(`https://cdn.destiny.gg/${type}/${type}.css`);
    const text = await res.text();
    fs.writeFile(`./${type}.css`, text);
}
