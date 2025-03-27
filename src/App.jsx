import classes from "./App.module.css";
import { Heading, Page } from "@wix/design-system";

function App() {
  return (
    <>
      <Page width="100vw" height="100vh" className={classes.root}>
        <Page.Header />
        <Page.Content>
          <Heading size="extraLarge">Hello World</Heading>
        </Page.Content>
      </Page>
    </>
  );
}

export default App;
