import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sortMQ from "postcss-sort-media-queries";

export const styles = () => {
    return app.gulp.src(app.path.src.scss)
        .pipe(sourcemaps.init()) 
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "CSS",
                message: "Error: <%= error.message %>"
            })
        ))
        .pipe(app.plugins.replace(/@img\//g, "../img/"))
        // SCSS → CSS
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        // PostCSS (автопрефіксер, сортування медіа, мініфікація)
        .pipe(app.plugins.ifPlugin(
            app.isBuild,
            postcss([
                autoprefixer({ grid: true }),
                sortMQ(),
                cssnano({ preset: "default" }) 
                    // тут і мініфікація, і видалення коментарів
            ])
        ))
        .pipe(app.plugins.ifPlugin(
            app.isBuild,
            app.plugins.rename({
                basename: "style",
                suffix: ".min"
            })
        ))
        .pipe(sourcemaps.write('.'))             // 5. Запис карти (в кінці, після всіх змін)
        .pipe(app.gulp.dest("dist/css"))
        .pipe(app.plugins.browserSync.stream());
};