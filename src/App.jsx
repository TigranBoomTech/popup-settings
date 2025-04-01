import Conditional_Mailing from "./containers/Conditional_Mailing/Conditional_Mailing";
import Templates from "./containers/Templates/Templates";
import { path } from "./helpers/common";

function App() {
  let tempPath = path;
  tempPath = "Conditional_Mailing";

  return (
    <>
<<<<<<< Updated upstream
      <Page width="100vw" height="100vh" className={classes.root}>
        <Page.Content>
          {(() => {
            switch (path) {
              case "Confirmation_Email":
              case "Notification_Email":
                return <div>Email Content</div>;
              case "Conditional_Mailing":
                return <div>Conditional Mailing</div>;
              case "Templates":
                return <Templates />;
              case "Addons_Store":
                return <div>Addons Store</div>;
              case "Custom_JS":
                return <div>Custom JS</div>;
              case "Logic":
                return <div>Logic</div>;
              case "Map_Modal":
                return <div>Map Modal</div>;
              default:
                return null;
            }
          })()}
        </Page.Content>
      </Page>
=======
      {(() => {
        switch (tempPath) {
          case "Confirmation_Email":
          case "Notification_Email":
            return <div>Email Content</div>;
          case "Conditional_Mailing":
            return <Conditional_Mailing />;
          case "Templates":
            return <Templates />;
          case "Addons_Store":
            return <div>Addons Store</div>;
          case "Custom_JS":
            return <div>Custom JS</div>;
          case "Logic":
            return <div>Logic</div>;
          case "Map_Modal":
            return <div>Map Modal</div>;
          default:
            return null;
        }
      })()}
>>>>>>> Stashed changes
    </>
  );
}

export default App;
