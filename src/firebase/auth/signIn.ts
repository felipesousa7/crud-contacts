import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebaseConfig';

const auth = getAuth(firebaseApp);

export default async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { result, error: null };
  } catch (error) {
    return { result: null, error };
  }
}
