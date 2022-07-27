#!/usr/bin/env node

import argv from '@prokopschield/argv';
import { server } from './server';

const { port } = argv
	.alias('port', 'p')
	.expectMutate(['port'], { port: '3000' });

server.listen(Number(port));
