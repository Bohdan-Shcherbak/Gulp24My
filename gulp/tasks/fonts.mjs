import ttf2woff2 from 'gulp-ttf2woff2';
import ttf2woff from 'gulp-ttf2woff';

export function ttfToWoff(){
   return app.gulp.src(app.path.src.fonts, {encoding: false, removeBOM: false,})
      .pipe(app.plugins.newer(app.path.build.fonts))
      .pipe(ttf2woff())
      .pipe(app.gulp.dest(app.path.build.fonts))
}

export function ttfToWoff2(){
   return app.gulp.src(app.path.src.fonts, {encoding: false, removeBOM: false,})
         .pipe(app.plugins.newer(app.path.build.fonts))
         .pipe(ttf2woff2())
         .pipe(app.gulp.dest(app.path.build.fonts))
}
export const fonts = app.gulp.series(ttfToWoff, ttfToWoff2)