import { promises as fs } from 'fs';

export const writeFile = (filePath: string, data: any) => {
    return fs.writeFile(
        filePath,
        JSON.stringify(data, null, 2)
    )
}