import { useState } from "react";
import Login from "./components/Login";
import UserCrud from "./components/UserCrud"; // Vistas protegidas
import Cultivos from "./components/ProductCrud"; // Otra vista protegida

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn ? (
        <div>
          <UserCrud />
          <Cultivos />
        </div>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;
