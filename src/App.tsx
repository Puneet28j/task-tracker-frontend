import { ThemeProvider } from "./components/theme-provider";
import { Home } from "./pages/Home";
import { ToastProvider } from "@/components/Toast";

const App = () => {
  return (
    <ToastProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Home />
      </ThemeProvider>
    </ToastProvider>
  );
};

export default App;
