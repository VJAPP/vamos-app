import { useState, useEffect } from 'react';
import Chat from './Components/Chat';
import Auth from './Components/Auth';
import Home from './Components/Home';
import Landing from './Components/Landing';
import TripList from './Components/TripList';
import Connections from './Components/Connections';
import PublishTrip from './Components/PublishTrip';
import PublishRequest from './Components/PublishRequest';


function App() {
  // --- CONFIGURACIÓN ---
  const SIMULATE_API = false; // <--- FALSE: CONEXIÓN REAL
  const API_URL = 'http://localhost:3000';

  // --- ESTADOS ---
  const [view, setView] = useState('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trips, setTrips] = useState([]);
  const [tripForm, setTripForm] = useState({
    origin: '',
    destination: '',
    date: '',
    price: '',
    description: '',
    contact_method: 'whatsapp', // <--- AGREGAR ESTO (Valor por defecto)
    contact_info: '', // <--- AGREGAR ESTO
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [connections, setConnections] = useState([]);
  const [chatTarget, setChatTarget] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    if (view === 'browse') fetchTrips();
  }, [view]);
  // Cargar conexiones reales cuando entramos a esa pantalla
  useEffect(() => {
    if (view === 'connections') fetchConnections();
  }, [view]);
  // --- MANEJADORES DE USUARIOS ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Procesando...');

    if (SIMULATE_API) {
      setTimeout(() => {
        setMessage('✅ ¡Registro exitoso!');
        setIsError(false);
        setTimeout(() => setView('login'), 1000);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('¡Registro exitoso! Ahora puedes ingresar.');
        setIsError(false);
        setTimeout(() => setView('login'), 1500);
      } else {
        setMessage(data.error || 'Error en el registro');
        setIsError(true);
      }
    } catch (error) {
      const err = error as any;
      setMessage(err.message || 'Error de conexión con el servidor');
      setIsError(true);
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Verificando...');

    if (SIMULATE_API) {
      setTimeout(() => {
        setMessage('¡Bienvenido!');
        setIsError(false);
        setConnections([]);
        setTimeout(() => setView('home'), 1000);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // --- CORRECCIÓN CRÍTICA: Guardar el nombre y email ---
        setName(data.user.name); // <--- ESTO FALTABA
        setEmail(data.user.email); // <--- ESTO FALTABA
        // ------------------------------------------------

        setConnections([]); // Limpiamos conexiones viejas

        setMessage(`¡Bienvenido, ${data.user.name}!`);
        setIsError(false);
        setTimeout(() => setView('home'), 1000);
      } else {
        setMessage(data.error || 'Error al ingresar');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
      setIsError(true);
      console.error(error);
    }
  };

  // --- MANEJADORES DE VIAJES ---

  // 1. Publicar Viaje (Conductor)
  const handlePublishTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setMessage(
        'Error: Sesión no iniciada. Por favor recarga la página y vuelve a entrar.'
      );
      setIsError(true);
      return;
    }

    if (SIMULATE_API) {
      const newTrip = {
        id: Date.now(),
        type: 'offer',
        driver_name: name || 'Conductor',
        origin: tripForm.origin,
        destination: tripForm.destination,
        date: tripForm.date,
        price: tripForm.price,
        description: tripForm.description,
      };
      setTrips([newTrip, ...trips]);
      setMessage('✅ Viaje publicado');
      setIsError(false);
      setTimeout(() => setView('browse'), 1500);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_name: name,
          type: 'offer',
          ...tripForm,
          // --- SEGURIDAD EXTRA ---
          // Si contact_method es undefined, usamos 'whatsapp' por defecto.
          // Esto evita el error "Unimplemented".
          contact_method: tripForm.contact_method || 'whatsapp',
          // Si contact_info es undefined, usamos un string vacío.
          contact_info: tripForm.contact_info || '',
        }),
      }); // <--- NOTA: Aquí se cierra el fetch

      // Esta línea debe ir FUERA del fetch
      const data = await response.json();

      if (response.ok) {
        const newTrip = {
          id: data.tripId,
          type: 'offer',
          driver_name: name,
          ...tripForm,
        };
        setTrips([newTrip, ...trips]);
        setMessage('✅ Viaje publicado correctamente');
        setIsError(false);
        setTripForm({
          origin: '',
          destination: '',
          date: '',
          price: '',
          description: '',
          contact_method: 'whatsapp', // <--- AGREGAR
          contact_info: '', // <--- AGREGAR
        });
        setTimeout(() => setView('browse'), 1500);
      } else {
        setMessage(data.error || 'Error al publicar');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
      setIsError(true);
      console.error(error);
    }
  };
  // --- BORRAR VIAJE ---
  const handleDeleteTrip = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      return; // Si el usuario cancela, no hacemos nada
    }

    try {
      const response = await fetch(`${API_URL}/api/trips/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 1. Mostramos mensaje de éxito
        setMessage('🗑️ Viaje eliminado correctamente');
        setIsError(false);

        // 2. Quitamos el viaje de la lista visualmente
        setTrips(trips.filter((trip: any) => trip.id !== id));
      } else {
        setMessage('Error al eliminar el viaje');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión');
      setIsError(true);
      console.error(error);
    }
  };
  // --- BORRAR CONEXIÓN ---
  const handleDeleteConnection = async (id: number) => {
    if (!window.confirm('¿Borrar este contacto de tu lista?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/requests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('🗑️ Contacto eliminado');
        setIsError(false);
        setConnections(connections.filter((c: any) => c.id !== id));
      } else {
        setMessage('Error al eliminar contacto');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión');
      setIsError(true);
    }
  };
  // 2. Publicar Solicitud (Pasajero)
  const handlePublishRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setMessage(
        'Error: Sesión no iniciada. Por favor recarga la página y vuelve a entrar.'
      );
      setIsError(true);
      return;
    }

    if (SIMULATE_API) {
      const newRequest = {
        id: Date.now(),
        type: 'request',
        driver_name: name || 'Pasajero',
        origin: tripForm.origin,
        destination: tripForm.destination,
        date: tripForm.date,
        price: tripForm.price,
        description: tripForm.description,
      };
      setTrips([newRequest, ...trips]);
      setMessage('✅ Solicitud publicada correctamente');
      setIsError(false);
      setTripForm({
        origin: '',
        destination: '',
        date: '',
        price: '',
        description: '',
        contact_method: '', // <--- AGREGAR ESTA LÍNEA
        contact_info: '', // <--- AGREGAR ESTA LÍNEA
      });
      setTimeout(() => setView('browse'), 1500);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_name: name,
          type: 'request',
          ...tripForm,
          // --- SEGURIDAD EXTRA ---
          // Si contact_method es undefined, usamos 'whatsapp' por defecto.
          // Esto evita el error "Unimplemented".
          contact_method: tripForm.contact_method || 'whatsapp',
          // Si contact_info es undefined, usamos un string vacío.
          contact_info: tripForm.contact_info || '',
        }),
      });

      // Esta línea debe ir FUERA del fetch
      const data = await response.json();

      if (response.ok) {
        const newRequest = {
          id: data.tripId,
          type: 'request',
          driver_name: name,
          ...tripForm,
        };
        setTrips([newRequest, ...trips]);
        setMessage('✅ Solicitud publicada correctamente');
        setIsError(false);
        setTripForm({
          origin: '',
          destination: '',
          date: '',
          price: '',
          description: '',
          contact_method: '', // <--- AGREGAR ESTA LÍNEA
          contact_info: '', // <--- AGREGAR ESTA LÍNEA
        });
        setTimeout(() => setView('browse'), 1500);
      } else {
        setMessage(data.error || 'Error al publicar');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
      setIsError(true);
      console.error(error);
    }
  };

  // --- MANEJADORES DE CONEXIONES ---
  const handleRequest = async (tripId: number) => {
    // 1. Buscamos los detalles del viaje en la lista local actual
    const trip = trips.find((t: any) => t.id === tripId);
    if (!trip) return;

    const confirmJoin = window.confirm(
      `¿Seguro que quieres unirte a este viaje con ${trip.driver_name}?`
    );
    if (!confirmJoin) return;

    setMessage('Enviando solicitud...');

    if (SIMULATE_API) {
      setTimeout(() => {
        alert(
          '✅ Solicitud enviada. Hemos guardado el contacto en "Mis Conexiones".'
        );
        setMessage('');
        const newConnection = {
          id: Date.now(),
          type: 'request_made',
          contact: trip.driver_name,
          details: `Te uniste al viaje de ${trip.driver_name} hacia ${trip.destination}.`,
          date: new Date().toLocaleDateString(),
        };
        setConnections([newConnection, ...connections]);
      }, 500);
      return;
    }

    // --- CONEXIÓN REAL: Enviar datos mejorados ---
    try {
      const response = await fetch(`${API_URL}/api/trips/${tripId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Enviamos el nombre del conductor y el destino
        body: JSON.stringify({
          passenger_name: name,
          driver_name: trip.driver_name,
          destination: trip.destination,
          passenger_email: email,
          // --- NUEVO: Enviamos los datos de contacto del conductor ---
          contact_method: trip.contact_method, // Método del dueño del viaje
          contact_info: trip.contact_info, // Número del dueño del viaje
        }),
      });

      if (response.ok) {
        alert(
          '✅ ¡Solicitud enviada! Hemos agregado este contacto a tu lista.'
        );
        setMessage('');

        // 3. Guardamos visualmente la conexión
        const newConnection = {
          id: Date.now(),
          type: 'request_made',
          contact: trip.driver_name,
          details: `Te uniste al viaje de ${trip.driver_name} hacia ${trip.destination}.`,
          date: new Date().toLocaleDateString(),
          // --- NUEVO: Pasar datos de contacto al componente ---
          contact_method: trip.contact_method,
          contact_info: trip.contact_info,
        };
        setConnections([newConnection, ...connections]);
      } else {
        setMessage('Error al enviar solicitud');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
      setIsError(true);
      console.error(error);
    }
  };
  // --- OBTENER LISTA DE VIAJES ---
  const fetchTrips = async () => {
    // Si estamos en simulación, usamos datos falsos si la lista está vacía
    if (SIMULATE_API && trips.length === 0) {
      setTrips([
        {
          id: 1,
          type: 'offer',
          driver_name: 'Juan P.',
          origin: 'Ciudad A',
          destination: 'Ciudad B',
          date: 'Viernes 18:00',
          price: '$500',
          description: 'Viaje directo.',
        },
        {
          id: 2,
          type: 'request',
          driver_name: 'Maria L.',
          origin: 'Centro',
          destination: 'Costa',
          date: 'Sábado 09:00',
          price: '$1200',
          description: 'Necesito viaje urgente.',
        },
      ]);
      return;
    }

    // --- CONEXIÓN REAL: LEER DE LA BASE DE DATOS ---
    try {
      const response = await fetch(`${API_URL}/api/trips`);
      const data = await response.json();
      if (response.ok) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error('Error cargando viajes:', error);
    }
  };
  const handleOfferDriver = async (
    tripId: number,
    passengerName: string,
    destination: string,
    trip: any // <--- AGREGAR ESTO
  ) => {
    const confirmOffer = window.confirm(
      `¿Seguro que quieres ofrecerte para llevar a ${passengerName} hacia ${destination}?`
    );
    if (!confirmOffer) return;

    if (SIMULATE_API) {
      const newConnection = {
        id: Date.now(),
        type: 'offer_made',
        contact: passengerName,
        details: `Te ofreciste para llevar a ${passengerName} a ${destination}.`,
        date: new Date().toLocaleDateString(),
      };
      setConnections([newConnection, ...connections]);
      alert(
        '✅ ¡Oferta enviada! Hemos agregado este contacto a tu lista de "Mis Conexiones".'
      );
      return;
    }

    // --- CONEXIÓN REAL: Enviar oferta al servidor ---
    try {
      const response = await fetch(`${API_URL}/api/trips/${tripId}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passenger_name: passengerName,
          driver_name: name,
          driver_email: email, // <--- ENVIA TU EMAIL
          destination: destination,
          // --- NUEVO: Enviar datos de contacto (heredados del viaje) ---
          contact_method: trip.contact_method || 'whatsapp',
          contact_info: trip.contact_info || '',
        }),
      });

      if (response.ok) {
        alert('✅ ¡Oferta enviada! Hemos agregado este contacto a tu lista.');

        // Agregamos visualmente la conexión
        const newConnection = {
          id: Date.now(),
          type: 'offer_made',
          contact: passengerName,
          details: `Te ofreciste para llevar a ${passengerName} a ${destination}.`,
          date: new Date().toLocaleDateString(),
        };
        setConnections([newConnection, ...connections]);
      } else {
        alert('Error al enviar la oferta');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
      console.error(error);
    }
  };
  // --- LEER CONEXIONES DE LA BASE DE DATOS ---
  // --- LEER CONEXIONES Y COLOREAR SEGÚN EL VIAJE ORIGINAL ---
  const fetchConnections = async () => {
    if (SIMULATE_API) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/requests?email=${email}`);
      const data = await response.json();

      if (response.ok) {
        const formattedConnections = data.requests.map((req: any) => {
          // Buscamos el viaje original en la lista local para saber su color
          const trip = trips.find((t: any) => t.id === req.trip_id);

          // Si el viaje era 'offer' (Cyan), la conexión es Cyan. Si era 'request' (Naranja), es Naranja.
          const tripType = trip ? trip.type : 'offer';

          return {
            id: req.id,
            type: 'request_made',
            tripType: tripType, // <--- IMPORTANTE: Enviando el tipo original
            contact: req.driver_name,
            // Ajustamos el texto para que tenga sentido según el tipo
            details:
              tripType === 'offer'
                ? `Te uniste al viaje de ${req.driver_name} hacia ${req.destination}.`
                : `Te ofreciste para llevar a ${req.passenger_name} hacia ${req.destination}.`,
            date: new Date().toLocaleDateString(),
            // --- FALTABA ESTO: Pasar los datos de contacto ---
            contact_method: req.contact_method,
            contact_info: req.contact_info,
            // --- FALTABA ESTO ---
            passenger_email: req.passenger_email,
            driver_email: req.driver_email,
            // --------------------
          };
        });

        setConnections(formattedConnections);
      }
    } catch (error) {
      console.error('Error cargando conexiones:', error);
    }
  };
  // --- CHAT ---
  const openChat = (contactName: string) => {
    setChatTarget(contactName);
    setChatMessages([{ text: `Hola, soy ${contactName}.`, sender: 'them' }]);
    setNewMessageText('');
    setView('chat');
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const myMsg = { text: newMessageText, sender: 'me' as const };
    setChatMessages([...chatMessages, myMsg]);
    setNewMessageText('');
    setTimeout(() => {
      const replyMsg = {
        text: '¡Entendido! Gracias por escribirme. Me parece bien el trato.',
        sender: 'them' as const,
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  // --- VISTAS ---
  if (view === 'home')
    return <Home userName={name} onNavigate={(newView) => setView(newView)} />;

  if (view === 'publish')
    return (
      <PublishTrip
        tripForm={tripForm}
        onInputChange={(e) =>
          setTripForm({ ...tripForm, [e.target.name]: e.target.value })
        }
        onSubmit={handlePublishTrip}
        onBack={() => setView('home')}
        message={message} // <--- AGREGAR ESTO
        isError={isError} // <--- AGREGAR ESTO
      />
    );

  if (view === 'publish_request')
    return (
      <PublishRequest
        tripForm={tripForm}
        onInputChange={(e) =>
          setTripForm({ ...tripForm, [e.target.name]: e.target.value })
        }
        onSubmit={handlePublishRequest}
        onBack={() => setView('home')}
        message={message} // <--- AGREGAR ESTO
        isError={isError} // <--- AGREGAR ESTO
      />
    );

  if (view === 'connections')
    return (
      <Connections
        connections={connections}
        currentUserEmail={email} // <--- AGREGAR
        onDelete={handleDeleteConnection} // <--- AGREGAR
        onOpenChat={openChat}
        onBack={() => setView('home')}
      />
    );

  if (view === 'chat')
    return <Chat target={chatTarget} onClose={() => setView('connections')} />;

  if (view === 'browse')
    return (
      <TripList
        trips={trips}
        currentUser={name} // <--- AGREGAR: Para saber quién soy
        onRequest={handleRequest}
        onOfferDriver={handleOfferDriver}
        onDelete={handleDeleteTrip} // <--- AGREGAR: La función de borrar
        onBack={() => setView('home')}
      />
    );

  if (view === 'register')
    return (
      <Auth
        mode="register"
        name={name}
        email={email}
        password={password}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        onRegister={handleRegister}
        onSwitchMode={() => setView('login')}
        message={message}
        isError={isError}
      />
    );

  if (view === 'login')
    return (
      <Auth
        mode="login"
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onLogin={handleLogin}
        onSwitchMode={() => setView('register')}
        message={message}
        isError={isError}
      />
    );

  return <Landing onNavigate={(newView) => setView(newView)} />;
}

export default App;
