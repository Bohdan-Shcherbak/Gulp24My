import gulp from 'gulp';
import sharp from 'sharp';
import clone from 'gulp-clone';
import merge from 'merge-stream';
import newer from 'gulp-newer';

const srcFiles = ['./src/images/**/**.*', '!images/**/**.svg'];

function optimized(){
  // Оптимізуємо оригінальні зображення
  return Promise.all([
    import('gulp-imagemin'),
    import('imagemin-mozjpeg'),
    import('imagemin-optipng')
  ]).then(([gulpimagemin,imageminmozjpeg,imageminoptipng])=>{
    const imagemin = gulpimagemin.default;
    const mozjpeg = imageminmozjpeg.default;
    const optipng = imageminoptipng.default;
    app.gulp.src(app.path.src.images)
    .pipe(newer('dist/images'))
    .pipe(imagemin([
      mozjpeg({ quality: 80, progressive: true }),
      optipng({ optimizationLevel: 3 })
    ], { verbose: true }))
    .pipe(app.gulp.dest(app.path.build.images))
  })
}

function convert() {
  return Promise.all([
    import('through2'),
    import('gulp-rename'),
  ]).then(([through2,gulpRename])=>{
  const through = through2.default;
  const rename = gulpRename.default;

  const cloneSink = clone.sink();

   // Генеруємо WebP
    const webpStream = gulp.src(app.path.src.images)
    .pipe(newer({ dest: 'dist/images', ext: '.webp' })) // Перевіряємо, чи файл новіший
    // through2 створює власний потік для обробки файлів індивідуально. З кожним окремим файлом у потоці
    // (file, enc, cb) - поточний файл,encoding який не використовується пропуск місця,
    //  Callback який передає оброблені файли далі
    .pipe(through.obj((file, enc, cb) => {
      sharp(file.contents)
        .webp({ quality: 80 })
        .toBuffer()//буферизація щоб простіше робити з файлом
        .then(data => {
          file.contents = data;
          cb(null, file); //повертає оброблений файл
        }) 
        .catch(err => cb(err, file)); //ловить помилки
    }))
    .pipe(rename({ extname: '.webp' }))
    .pipe(app.gulp.dest(app.path.build.images));

    const webp = webpStream.pipe(cloneSink);

  // Генеруємо AVIF
  const avifStream = cloneSink.tap()
    .pipe(newer({ dest: 'dist/images', ext: '.avif' })) // Перевіряємо наявність нового файлу
    .pipe(through.obj((file, enc, cb) => {
      sharp(file.contents)
        .avif({ quality: 50 }) // Налаштуйте якість за потреби
        .toBuffer()
        .then(data => {
          file.contents = data;
          cb(null, file);
        })
        .catch(err => cb(err, file));
    }))
    .pipe(rename({ extname: '.avif' }))
    .pipe(app.gulp.dest(app.path.build.images));

  // Об’єднуємо всі потоки
  return merge(webp, avifStream)
})
}
const images = gulp.series(convert);
export default images;

