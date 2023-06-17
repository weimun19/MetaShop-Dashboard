import "./App.css";
import MainDash from "./components/MainDash/MainDash";
import UserView from "./components/UserView/UserView";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

function App() {
  const [Selected, SetSelected] = useState(0);

  const [Expanded, SetExpaned] = useState(true);
  return (
    <div className="App">
      <div className="AppGlass">
        <Sidebar
          selected={Selected}
          setSelected={SetSelected}
          expanded={Expanded}
          setExpaned={SetExpaned}
        />
        {Selected === 0 && <MainDash />}
        {Selected === 1 && <UserView />}
        {Selected === 2 && <span>Future Enhancements</span>}
      </div>
    </div>
  );
}

export default App;
