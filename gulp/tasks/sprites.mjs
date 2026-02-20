// gulpfile.js (ESM)
import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
export const sprites = () => {
  return app.gulp.src(app.path.src.svg)
    // 1) Оптимізація SVG (сучасна, без помилок)
    .pipe(svgmin({
      full: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false, // ЧОМУ: щоб SVG масштабувались
            }
          }
        }
      ]
    }))

    // 2) Чистимо fill/stroke (щоб стиль задавати через CSS)
    .pipe(cheerio({
      run: ($) => {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))

    // 3) Виправляємо символи >, які cheerio ламає
    .pipe(app.plugins.replace('&gt;', '>'))

    // 4) Формуємо symbol-спрайт
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../icons/sprite.svg",    // ЧОМУ: правильний шлях у dist/img
          example: true            //  demo html
        }
      },
      shape: {
        id: {
          generator: function (name) {
            return name.split('\\').pop().replace('.svg','')
          }
        }}
    }))

    .pipe(app.gulp.dest(app.path.build.img));
};
