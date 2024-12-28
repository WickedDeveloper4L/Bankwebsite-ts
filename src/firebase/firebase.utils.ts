import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCOUhiqUVCZg-3mcA2P1B94IHhROVwz9RQ",
//   authDomain: "bank-site-606ef.firebaseapp.com",
//   projectId: "bank-site-606ef",
//   storageBucket: "bank-site-606ef.appspot.com",
//   messagingSenderId: "993752705494",
//   appId: "1:993752705494:web:e6906e93f1b2bf21909c77",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCS9tNOotsa5snPjcvCWpMYIBf1yU3uZPs",
  authDomain: "citytob-5456b.firebaseapp.com",
  projectId: "citytob-5456b",
  storageBucket: "citytob-5456b.firebasestorage.app",
  messagingSenderId: "76576364590",
  appId: "1:76576364590:web:9749e6da4a593ab7bb67bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);

export const auth = getAuth();
export const createUserProfileDocument = async (
  userAuth: any,
  additionalData: any
) => {
  if (!userAuth) return;

  const userRef = doc(database, `/users/${userAuth.uid}`);

  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { email } = userAuth;
    const createdAt = new Date().getTime();
    try {
      await setDoc(userRef, {
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error: any) {
      console.log("error creating user", error.message);
    }
  }
  return userRef;
};

export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubcribe = auth.onAuthStateChanged((userAuth) => {
      unsubcribe();
      resolve(userAuth);
    }, reject);
  });
};

export const handleWithdrawals = async (
  userId: any,
  data: any
): Promise<void> => {
  const userRef: DocumentReference<DocumentData> = doc(
    database,
    `/users/${userId}`
  );
  const snapShot = await getDoc(userRef);
  const prevData: any = snapShot.data();
  console.log(`prevData ${prevData}`);
  try {
    await setDoc(userRef, {
      ...prevData,
      withdrawals: [...prevData.withdrawals, data],
      checkingBalance: Number(prevData.checkingBalance) - Number(data.amount),
    });
  } catch (error) {
    console.log(error);
  }
};
