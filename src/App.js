import './App.css';
import MyRoutes from './routes/MyRoutes';
import { initializeApp } from 'firebase/app';
import { FirebaseConfig } from './network/FirebaseConfig.jsx';

initializeApp(FirebaseConfig);

function App() {
    return <MyRoutes />;
}

export default App;
