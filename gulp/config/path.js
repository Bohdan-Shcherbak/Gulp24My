// Отримуєм ім'я папки проекту
// імпортуємо модуль path
import * as nodePath from 'path';
// за допомогою нього отримуємо назву папки проекта
const rootFolder = nodePath.basename(nodePath.resolve());

// шлях до папки з результатом
const buildFolder = `./dist`;
// шлях до папки з джерелами
const srcFolder = `./src`;

// зберігається вся інформація про шляхи до любого файлу або папки
export const path = {
     // обєект шляхів до результату папки
     build: {
          js: `${buildFolder}/js/`,
          css: `${buildFolder}/css/`,
          html: `${buildFolder}/`,
          img: `${buildFolder}/img/`,
          svg: `${buildFolder}/img/*.svg`,
          fonts: `${buildFolder}/fonts/`,
          // результати будуть кидатись до папки з результатами до папки файли 
          files: `${buildFolder}/files/`
     },
     // обєект шляхів до джерела папки
     src: {
          js: `${srcFolder}/js/app.js`,
          jsF: `${srcFolder}/js/**/*.{js,mjs}`,
          scss: `${srcFolder}/scss/style.scss`,
          // підключення картинок
          img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
          svg: `${srcFolder}/img/**/*.svg`,
          // html: `${srcFolder}/*.pug`,
          html: `${srcFolder}/*.html`,
          // вказуємо, що початковий файл знаходитья в початковій папці, в папці файли та має будь-яку вкладеність,назву,розширення
          files: `${srcFolder}/files/**/*.*`,
          // svg спрайти
          svgicons: `${srcFolder}/svgicons/*.svg`,
          fonts: `${srcFolder}/fonts/**.ttf`,

     },
     // окремо вкажемо шляхи до файлів і папок за якими повинен стежити галп і при зміненнях виконувати дії
     watch: {
          js: `${srcFolder}/js/**/*.{mjs,js}`,
          scss: `${srcFolder}/scss/**/*.scss`,
          img: `${srcFolder}/img/**/*.{jpg,jpeg,ico,png,gif,webp}`,
          html: `${srcFolder}/**/*.html`,
          files: `${srcFolder}/files/**/*.*`,
     },
     // Властивості
     // видаляє в папці результат
     clean: buildFolder,
     // дорівнюж папці з результатом
     buildFolder: buildFolder,
     // шлях шляху
     srcFolder: srcFolder,
     // назва папки проекта
     rootFolder: rootFolder,
     // папка на віддаленому фтп сервері
     // папка на сервері
     ftp: ``
}

export const configFTP = {
	host: "", // Адреса FTP сервера
	user: "", // Ім'я користувача
	password: "", // Пароль
	parallel: 5 // Кількість одночасних потоків
}