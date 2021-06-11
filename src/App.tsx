import React from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        This App is deployed to AWS Amplify
      </header>
      <main>
        <h4>Hello AWS!</h4>
        <AmplifySignOut />
      </main>
    </div>
  );
};

export default withAuthenticator(App);
