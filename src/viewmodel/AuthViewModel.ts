import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../services/firebase";

export const signupUser = async (
  email: string,
  password: string
) => {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
};

export const loginUser = async (
  email: string,
  password: string
) => {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};