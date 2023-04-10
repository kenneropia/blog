import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes";
import Navbar from "./components/NavBar";

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />

      <AppRoutes />

      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </>
  );
};

export default App;
