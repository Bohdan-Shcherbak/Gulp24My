import './gulp/config/globalApp.mjs';

// імпорт задач
import {styles} from './gulp/tasks/style.mjs';
import {images} from './gulp/tasks/images.mjs';
import { sprites } from './gulp/tasks/sprites.mjs';
import {html} from './gulp/tasks/html.mjs';
import {reset} from './gulp/tasks/del.mjs';
import {js} from './gulp/tasks/js.mjs';
import {fonts} from './gulp/tasks/fonts.mjs';

// Експорт задач
export {styles};
export {images};
export {sprites};
export {html};
export {js};
export {reset};
export {fonts};

export function funcBrowserSync (){
    // підключення серверу
     app.plugins.browserSync.init({
          server:{
               baseDir:'dist/'
          },
          notify: false,
          port: 3000,
     });
    app.gulp.watch(app.path.watch.scss, styles);
     app.gulp.watch(['src/html/*.html', 'src/html/components/*.html'], html)
     app.gulp.watch(['src/html/**/*.html'], html)

     app.gulp.watch(app.path.watch.html, html);

     app.gulp.watch(app.path.watch.js, js)
     app.gulp.watch(app.path.watch.img, images);

     app.gulp.watch(['dist/index.html']).on('change', app.plugins.browserSync.reload)
}

const development = app.gulp.series(app.gulp.parallel(images,styles, html), js, funcBrowserSync);
const build = app.gulp.series(reset, app.gulp.parallel(images,styles,html,sprites,fonts), js, funcBrowserSync);

const sprite = sprites;
const font = fonts;

export {development};
export {build};
export {sprite};
export {font};

export default development;
