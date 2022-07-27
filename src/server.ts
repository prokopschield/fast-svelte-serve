import http from 'http';
import { read } from './read';

export const server = http.createServer((req, res) => {
	req.on('data', () => {});
	req.on('end', async () => {
		try {
			const result = await read(req.url || 'index.html');

			res.setHeader('content-type', result.type);
			res.setHeader('content-length', result.data.length);

			console.log(result);

			res.write(result.data);
			res.end();
		} catch (error) {
			res.statusCode = 500;

			res.setHeader('content-type', 'text/plain');

			res.end(String(error));
		}
	});
});
