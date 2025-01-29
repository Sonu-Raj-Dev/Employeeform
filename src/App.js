import React from "react";
import AppNavigator from "./Navigation/AppNavigator";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster />
        <AppNavigator />
      </BrowserRouter>
    </div>
  );
}

export default App;
