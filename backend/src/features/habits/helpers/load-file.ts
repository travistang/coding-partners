import { promises as fs } from 'fs';

export const loadFile = async (filePath: string, defaultData: any) => {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data;
    } catch {
        return defaultData;
    }
}