import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthContext } from '../context/AuthContext';
import { firestore } from '../firebase/firebaseConfig';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert , { AlertProps } from '@mui/material/Alert';

interface Contact {
  contactId: string;
  name: string;
  phoneNumber: string;
  email: string;
}

const AddContactsPage = () => {
  const { userAuth } = useAuthContext();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Contact>({ contactId: '', name: '', phoneNumber: '', email: '' });
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' ou 'error'

  useEffect(() => {
    if (userAuth) {
      fetchContacts();
    }
  }, [userAuth]);

  const fetchContacts = async () => {
    try {
      const contactsCollection = collection(firestore, 'contacts');
      const contactsSnapshot = await getDocs(contactsCollection);
      const fetchedContacts = contactsSnapshot.docs.map((doc) => ({
        contactId: doc.id,
        name: doc.data().name,
        phoneNumber: doc.data().phoneNumber,
        email: doc.data().email,
      }));
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Erro ao buscar contatos: ', error);
    }
  };

  const addContact = async () => {
    if (newContact.name.trim() !== '' && contacts.length < 5) {
      try {
        const contactRef = await addDoc(collection(firestore, 'contacts'), {
          name: newContact.name.trim(),
          phoneNumber: newContact.phoneNumber.trim(),
          email: newContact.email.trim(),
        });
        const newContactData = {
          contactId: contactRef.id,
          name: newContact.name.trim(),
          phoneNumber: newContact.phoneNumber.trim(),
          email: newContact.email.trim(),
        };
        setContacts([...contacts, newContactData]);
        setNewContact({ contactId: '', name: '', phoneNumber: '', email: '' });
        handleSnackbarOpen('success');
      } catch (error) {
        console.error('Erro ao adicionar contato: ', error);
        handleSnackbarOpen('error');
      }
    }
  };

  const removeContact = async (contactId: string) => {
    try {
      await deleteDoc(doc(firestore, 'contacts', contactId));
      setContacts(contacts.filter((contact) => contact.contactId !== contactId));
      handleSnackbarOpen('success');
    } catch (error) {
      console.error('Erro ao remover contato: ', error);
      handleSnackbarOpen('error');
    }
  };

  const handleSendMessage = async () => {
    try {
      const dispatchRef = await addDoc(collection(firestore, 'dispatches'), {
        message,
      });
      console.log('Disparo criado com ID: ', dispatchRef.id);

      for (const contact of contacts) {
        await addDoc(collection(firestore, 'contacts', contact.contactId, 'messages'), {
          dispatchId: dispatchRef.id,
          message,
        });
      }

      setShowModal(false);
      setMessage('');
      handleSnackbarOpen('success');
    } catch (error) {
      console.error('Erro ao criar disparo: ', error);
      handleSnackbarOpen('error');
    }
  };

  const handleSnackbarOpen = (type: string) => {
    setSnackbarType(type);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!userAuth) {
    router.push('/signIn');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">Adicionar Contatos</h1>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Nome"
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
            <input
              type="text"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              placeholder="Telefone"
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
            <button onClick={addContact} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Adicionar Contato
            </button>
          </div>

          <h2 className="text-gray-900 font-bold mb-2">Lista de Contatos:</h2>
          <div className="flex justify-between items-center text-gray-700 text-sm font-semibold">
            <div>Nome</div>
            <div>Telefone</div>
            <div>Email</div>
            <div>Excluir</div>
          </div>
          <ul className="list-disc list-inside mb-4">
            {contacts.map((contact, index) => (
              <li key={index} className="text-gray-900 flex justify-between items-center">
                <div >{contact.name}</div>
                <div >{contact.phoneNumber}</div>
                <div >{contact.email}</div>
                <button
                  onClick={() => removeContact(contact.contactId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <DeleteIcon />
                </button>
              </li>
            ))}
          </ul>

          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Salvar Contatos
          </button>

          {showModal && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-md w-80">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Pop-up Disparo</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                    Fechar
                  </button>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="w-full h-32 border border-gray-300 rounded-md p-2 text-gray-900"
                />
                <div className="flex justify-end mt-4">
                  <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">
                    Enviar
                  </button>
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000} // Tempo em milissegundos
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarType as AlertProps['severity']}
            >
              {snackbarType === 'success' ? 'Operação realizada com sucesso!' : 'Erro ao realizar a operação.'}
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default AddContactsPage;
