import classes from "./App.module.css";
import { Page } from "@wix/design-system";
import Templates from "./containers/Templates/Templates";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  // should be changed to const and be clear based on url's 'shorType' param
  let path = urlParams.get("showType");
  path = "Templates";

  return (
    <>
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
    </>
  );
}

export default App;
