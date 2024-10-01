// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAPzqVden4SRynoYtG70sJgDLgEW_Juig0",
//   authDomain: "solis-e.firebaseapp.com",
//   databaseURL: "https://solis-e-default-rtdb.firebaseio.com",
//   projectId: "solis-e",
//   storageBucket: "solis-e.appspot.com",
//   messagingSenderId: "586905226107",
//   appId: "1:586905226107:web:9914d76fd8128554d2cbde",
//   measurementId: "G-3NQ158N8FN"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);

// export async function uploadFileToFirebase(image_url: string, name: string) {
//   try {
//     const response = await fetch(image_url);
//     const buffer = await response.arrayBuffer();
//     const file_name = name.replace(" ", "") + Date.now + ".jpeg";
//     const storageRef = ref(storage, file_name);
//     await uploadBytes(storageRef, buffer, {
//       contentType: "image/jpeg",
//     });
//     const firebase_url = await getDownloadURL(storageRef);
//     return firebase_url;
//   } catch (error) {
//     console.error(error);
//   }
// }
