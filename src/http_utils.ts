import fs from 'fs';
import https from 'https';

export const download = async (url: string, path: string) => {
  const data = await new Promise<string>((resolve) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });
  });
  fs.writeFileSync(path, data);
};
