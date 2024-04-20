import React, { useState, FormEvent } from "react";
import signUp from "../firebase/auth/signUp";
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const router = useRouter()

    const handleForm = async (event: FormEvent) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            console.log(error);
            setSnackbarMessage('Erro ao cadastrar!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } else {
            console.log(result);
            setSnackbarMessage('Cadastro realizado com sucesso!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            return router.push("/signIn");
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">Cadastrar</h1>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleForm}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border
                                border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none
                                focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="new-password" required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border
                                border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none
                                focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4
                            border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600
                            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cadastrar
                        </button>
                    </div>
                    <span className="text-sm mt-2 text-gray-600">Já está cadastrado? <button type="button" onClick={() => router.push("/signIn")} className="text-blue-500 hover:underline">Fazer Login</button></span>
                </form>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default SignUp;
