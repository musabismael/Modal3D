import React, { useState } from "react";
import "./App.css";
import Modal3D from "./Modal3D";

function App() {
  const [familyName, setFamilyName] = useState("");
  const [hasSon, setHasSon] = useState(false);
  const [hasDaughter, setHasDaughter] = useState(false);
  const [hasWife, setHasWife] = useState(false);
  const [hasOther, setHasOther] = useState(false);

  return (
    <div className="app-container">
      <div className="form-container">
        <h2>Family Information</h2>
        <form>
          <label>
            Family Name:
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
            />
          </label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={hasSon}
                onChange={(e) => setHasSon(e.target.checked)}
              />
              Son
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasDaughter}
                onChange={(e) => setHasDaughter(e.target.checked)}
              />
              Daughter
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasWife}
                onChange={(e) => setHasWife(e.target.checked)}
              />
              Wife
            </label>
            <label>
              <input
                type="checkbox"
                checked={hasOther}
                onChange={(e) => setHasOther(e.target.checked)}
              />
              Other Family Member
            </label>
          </div>
        </form>
      </div>
      <div className="map-container">
        <Modal3D
          hasSon={hasSon}
          hasDaughter={hasDaughter}
          hasWife={hasWife}
          hasOther={hasOther}
        />
      </div>
    </div>
  );
}

export default App;
