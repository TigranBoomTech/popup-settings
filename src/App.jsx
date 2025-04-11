import Addons from "./containers/Addons/Addons";
import Conditional_Mailing from "./containers/Conditional_Mailing/Conditional_Mailing";
import Logic from "./containers/Logic/Logic";
import Mail_Editor from "./containers/Mail_Editor/Mail_Editor";
import Map from "./containers/Map/Map";
import Templates from "./containers/Templates copy/Templates";
import { path } from "./helpers/common";

function App() {
  let tempPath = path;
  tempPath = "Conditional_Mailing"; // For testing purposes

  return (
    <>
      {(() => {
        switch (tempPath) {
          case "Confirmation_Email":
          case "Notification_Email":
            return <Mail_Editor />;
          case "Conditional_Mailing":
            return <Conditional_Mailing />; // AddItem
          case "Templates":
            return <Templates />; // Tuyna
          case "Addons_Store":
            return <Addons />; // Tuyna
          case "Custom_JS":
            return <div>Custom JS</div>; // Kino
          case "Logic":
            return <Logic />; // Full refact + Kino x2
          case "Map_Modal":
            return <Map />; // Full refact
          default:
            return null;
        }
      })()}
    </>
  );
}

export default App;
