import Addons from "./containers/Addons/Addons";
import Conditional_Mailing from "./containers/Conditional_Mailing/Conditional_Mailing";
import Logic from "./containers/Logic/Logic";
import Mail_Editor from "./containers/Mail_Editor/Mail_Editor";
import Map from "./containers/Map/Map";
import Templates from "./containers/Templates/Templates";
import { path } from "./helpers/common";

function App() {
  let tempPath = path;
  tempPath = "Logic"; // For testing purposes

  return (
    <>
      {(() => {
        switch (tempPath) {
          case "Confirmation_Email":
          case "Notification_Email":
            return <Mail_Editor />;
          case "Conditional_Mailing":
            return <Conditional_Mailing />;
          case "Templates":
            return <Templates />;
          case "Addons_Store":
            return <Addons />;
          case "Custom_JS":
            return <div>Custom JS</div>;
          case "Logic":
            return <Logic />;
          case "Map_Modal":
            return <Map />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default App;
