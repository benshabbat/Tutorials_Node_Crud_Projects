import fs from 'fs/promises';


export async function readUsers(){
    const data = await fs.readFile('./users.json', 'utf-8');
    return JSON.parse(data);
}