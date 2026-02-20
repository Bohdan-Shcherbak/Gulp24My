import esbuild from "gulp-esbuild";

export function js(){    
    return app.gulp.src(app.path.src.js)
    .pipe(app.plugins.plumber(
                app.plugins.notify.onError({
                    title: "Js",
                    message: "Error: <%= error.message %>"
                })
    ))    .pipe(esbuild({
        bundle: true,            // ← об’єднання всіх імпортів в один файл
        format: "iife",          // ← формат для браузера без type="module"
        minify: app.isBuild,        // ← мінімізація лише в production
        outfile: app.plugins.ifPlugin(app.isBuild, "app.min.js","app.js"),
        legalComments: app.isDev? 'inline' : 'none',
        sourcemap : true,
        loader: {
            ".js": "js",
            ".mjs": "js",
          }
    }))
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browserSync.stream())
}