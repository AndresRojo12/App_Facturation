import { HashRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import AppRoutes from "./routes";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <HashRouter>
      <AppRoutes token={token} onLogin={setToken} />
    </HashRouter>
  );
}

export default App;