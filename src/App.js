import './App.css';
import MyRoutes from './routes/MyRoutes';
import { FirebaseConfig } from './network/FirebaseConfig.jsx';
import { initializeApp } from 'firebase/app';

initializeApp(FirebaseConfig);

function App() {
    return <MyRoutes />;
}

export default App;
