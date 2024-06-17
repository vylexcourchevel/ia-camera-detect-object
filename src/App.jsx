import "./App.css";
import { Route, Routes } from 'react-router-dom';
import Template from "./components/Template/Template";
import TestVideo from "./components/TestVideo/TestVideo";
import TestIA from "./components/TestIA/TestIA";
import TestIndexesDB from "./components/TestIndexesDB/TestIndexesDB";
import HomePage from "./pages/PageHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Template />}>
        <Route index element={<HomePage />} />
        <Route path="/test-ia" element={<TestIA />} />
        <Route path="/test-stockage" element={<TestIndexesDB />} />
        <Route path="/test-video" element={<TestVideo />} />
      </Route>
    </Routes>
  );
}

export default App;
