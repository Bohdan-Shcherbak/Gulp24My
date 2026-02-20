// сборщик штмл файлів в 1
import fileinclude from 'gulp-file-include';
// робить структуру <picture><sourse></picture>
import gulpAvifWebpRetinaHtml from 'gulp-avif-webp-retina-html'
// додає дату та час
import versionNumber from 'gulp-version-number';
import htmlhint from "gulp-htmlhint";
import htmlmin from 'gulp-htmlmin';
import htmlReplace from "gulp-html-replace";

export function html(){
    return app.gulp.src(app.path.src.html)
    // помилки
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "html",
            message: "Error: <%= error.message %>"
        })))
        // об'єднує файли в один
    .pipe(fileinclude())
    // покаже помилки в консолі
    .pipe(htmlhint.reporter())
    .pipe(app.plugins.replace(/@img\//g, './img/'))
    .pipe(app.plugins.replace(/\.\.\/img\//g, './img/'))
    .pipe(
            app.plugins.ifPlugin(
                app.isBuild,
                gulpAvifWebpRetinaHtml()
            )
    )
    .pipe(app.plugins.ifPlugin(
        app.isBuild,
        htmlReplace({
            'css':'./css/style.min.css',
            'js':'../js/app.min.js'
      })))
    .pipe(
        app.plugins.ifPlugin(
            app.isBuild,
            versionNumber({
                'value': '%DT%',
                'append': {
                    'key': '_v',
                    'cover': 0,
                    'to': [
                        'css',
                        'js'
                    ]
                },
                'output': {
                    'file': 'gulp/version.json'
                }
            })
        )
    )
    .pipe(
        app.plugins.ifPlugin(
            app.isBuild,
            htmlmin({ collapseWhitespace: true,
                removeComments: true
            })
        )
    )
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browserSync.stream())
}