import imagemin from "gulp-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import webp from "gulp-webp";
import imageminAvif from "imagemin-avif";

export const optimized = () => {
    return app.gulp.src(app.path.src.img, { encoding: false })
        .pipe(app.plugins.newer(app.path.build.img))
        .pipe(imagemin([
            imageminMozjpeg({ quality: 80, progressive: true }),
            imageminPngquant({ quality: [0.6, 0.8] }),
            imageminGifsicle({ interlaced: true }),
        ]))
        .pipe(app.gulp.dest(app.path.build.img));
};

export const webpImages = () => {
    return app.gulp.src(app.path.src.img, { encoding: false })
        .pipe(app.plugins.newer({ dest: app.path.build.img, ext: ".webp" }))
        .pipe(webp({ quality: 80 }))
        .pipe(app.gulp.dest(app.path.build.img));
};

export const avifImages = () => {
    return app.gulp.src(app.path.src.img, { encoding: false })
        .pipe(app.plugins.newer({ dest: app.path.build.img, ext: ".avif" }))
        .pipe(imagemin([imageminAvif({ quality: 60 })]))
        .pipe(app.plugins.rename({ extname: ".avif" }))
        .pipe(app.gulp.dest(app.path.build.img));
};

export const images = app.gulp.series(optimized, webpImages, avifImages);
