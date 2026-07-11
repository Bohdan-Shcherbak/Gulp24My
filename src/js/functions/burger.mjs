import { bodyLock,bodyUnlock,bodyLockStatus, bodyLockToggle } from "../modules.mjs";
// Модуль роботи з меню (бургер) =======================================================================================================================================================================================================================
export function menuInit() {
    if (document.querySelector(".icon-menu")) {
        document.addEventListener("click", function (e) {
            if (bodyLockStatus && e.target.closest('.icon-menu')) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        });
    };
}
// export function menuInit() {
//     if (document.querySelector(".icon-menu")) {
//         document.addEventListener("click", function (e) {
//             const isMenuOpen = document.documentElement.classList.contains("menu-open");
//             if (bodyLockStatus && e.target.closest('.icon-menu')) {
//                 bodyLockToggle();
//                 document.documentElement.classList.toggle("menu-open");
//             }else if(bodyLockStatus && isMenuOpen && !e.target.closest('.menu')){
//                 document.documentElement.classList.remove("menu-open");
//                 bodyLockToggle();
//             }
//             });
// }}
export function menuOpen() {
    bodyLock();
    document.documentElement.classList.add("menu-open");
}
export function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}