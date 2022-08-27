import mmap from '@prokopschield/mmap';
import fs from 'fs';
import { contentType } from 'mime-types';
import path from 'path';
import { cacheFn } from 'ps-std';

export const isFile = async (filename: string) => {
	try {
		const stat = await fs.promises.stat(filename);

		return stat.isFile();
	} catch {
		return false;
	}
};

export const map = cacheFn((filename: string) => mmap(filename, true));

export interface ReadResult {
	data: Buffer;
	type: string;
}

export const cache = new Map<string, ReadResult>();

const distdir = fs.existsSync('dist') ? 'dist' : 'public';

export async function read(url: URL | string): Promise<ReadResult> {
	const { pathname } = new URL(url, 'http://localhost');

	const existing = cache.get(pathname);

	if (existing) {
		return existing;
	}

	const type = contentType(path.basename(pathname)) || 'text/plain';

	const filePath = path.resolve(
		distdir,
		path.relative('/', path.resolve(pathname))
	);

	if (url === 'index.html' && !isFile(filePath)) {
		throw new Error('index.html not found');
	}

	const result = (await isFile(filePath))
		? { data: map(filePath), type }
		: await read('index.html');

	cache.set(pathname, result);

	return result;
}
