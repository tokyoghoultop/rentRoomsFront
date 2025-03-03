import { useNavigate } from "react-router-dom";

let navigateFunction;

export const NavigateSetter = () => {
    navigateFunction = useNavigate();
    return null; // ไม่ต้องแสดงอะไร
};

// export const globalNavigate = (path) => {
//     if (navigateFunction) {
//         navigateFunction(path);
//     } else {
//         console.error("Navigate function is not initialized.");
//     }
// };


export const globalNavigate = (path, options) => {
    if (navigateFunction) {
        navigateFunction(path, options);
    } else {
        console.error("Navigate function is not initialized.");
    }
};