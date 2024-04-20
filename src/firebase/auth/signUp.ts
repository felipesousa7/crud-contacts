import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';

const auth = getAuth(firebaseApp);

export default async function signUp(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}
