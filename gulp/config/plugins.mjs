// обробляє помилки які виникають
import plumber from 'gulp-plumber';
// оповіщає про помилки
import notify from 'gulp-notify'
// локальний сервер
import browserSync from 'browser-sync';
// условное ветвление
import ifPlugin from 'gulp-if';

import rename from "gulp-rename";


import newer from 'gulp-newer';


import replace from 'gulp-replace'

// карта мініфікації
import sourcemaps from 'gulp-sourcemaps';


const plugins = {
    plumber: plumber,
    notify: notify,
    browserSync: browserSync,
    ifPlugin: ifPlugin,
    replace: replace,
    sourcemaps:sourcemaps,
    newer:newer,
    rename:rename,
}

export default  plugins;