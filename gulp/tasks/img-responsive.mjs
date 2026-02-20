import imagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import newer from "gulp-newer";
import responsive from 'gulp-responsive';

export const img = () =>{
     return app.gulp.src([app.path.src.img, app.path.src.svg],{since: app.gulp.lastRun(images)})
          .pipe(app.plugins.plumber(
               app.plugins.notify.onError({
                    title: "IMAGES",
                    message: "Error: <%= error.message %>",
               })
          ))
          .pipe(newer(app.path.build.img))

           // Оптимізація оригіналів
          .pipe(
               imagemin([
               imageminMozjpeg({ quality: 80, progressive: true }),
               imageminPngquant({ quality: [0.6, 0.8] }),
               imageminGifsicle({ interlaced: true }),
               imageminSvgo(),
               ])
          )
          .pipe(app.gulp.dest(app.path.build.img))
          .pipe(app.gulp.src(app.path.src.img))
          .pipe(responsive({
               "*": [
                    { format: "webp", rename: { extname: ".webp" }, quality: 80 },
                    { format: "avif", rename: { extname: ".avif" }, quality: 50, }
               ]
          },{
               silent: false,       // тихий режим
               withMetadata: false // прибрати EXIF
          }))
          .pipe(app.gulp.dest(app.path.build.img))

}