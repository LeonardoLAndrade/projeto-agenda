import Calendar from "./pages/Calendar";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    const originalWarn = console.error;
    // eslint-disable-next-line no-console
    console.error = (...args) => {
      if (
        args[0].includes(
          "Support for defaultProps will be removed from function components in a future major release."
        )
      ) {
        return;
      }
      originalWarn(...args);
    };
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Calendar />
    </div>
  );
}

export default App;
