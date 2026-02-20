import gulp from 'gulp'
import plugins from './plugins.mjs'
import { path } from './path.js';

globalThis.app = {
     // process.argv - масив, дій, які викoную. 
     // [дія 'node', файл 'gulp.js, флаг '--build']
     // includes перевіряє чи є в команді, що ввів, 
     // тобто в масиві флаг '--build'
     isBuild: process.argv.includes('--build'),
     isDev: !process.argv.includes('--build'),
     path: path,
     gulp: gulp,
     plugins: plugins,
}