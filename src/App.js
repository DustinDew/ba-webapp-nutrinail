import "./css/global.css";
import ScrollPage from "./components/scroll-page.js";
import { LanguageProvider } from "./context/language-context.js"; // ggf. Pfad anpassen

const App = () => {
  return (
    <LanguageProvider>
      <div>
        <ScrollPage />
      </div>
    </LanguageProvider>
  );
};

export default App;
