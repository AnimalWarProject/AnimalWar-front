import './App.css';
import MyRoutes from './routes/MyRoutes';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './network/firebaseConfig.jsx';

initializeApp(firebaseConfig);

function App() {
    return <MyRoutes />;
}

export default App;
