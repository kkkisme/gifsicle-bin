'use strict';
const path = require('path');
const binBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

(async () => {
	try {
		await bin.run(['--version']);
		log.success('gifsicle pre-build test passed successfully');
	} catch (error) {
		log.warn(error.message);
		log.warn('gifsicle pre-build test failed');
		log.info('compiling from source');

		const config = [
			'./configure --disable-gifview --disable-gifdiff',
			`--prefix="${bin.dest()}" --bindir="${bin.dest()}"`
		].join(' ');

		try {
			await binBuild.file(path.resolve(__dirname, '../vendor/source/gifsicle.tar.gz'), [
				'autoreconf -ivf',
				config,
				'make install'
			]);

			log.success('gifsicle built successfully');
		} catch (error2) {
			log.error(error2.stack);

			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(1);
		}
	}
})();
