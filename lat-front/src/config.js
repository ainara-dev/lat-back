let port;

if (process.env.REACT_APP_NODE_ENV === "test") {
  port = 8080;
} else {
  port = 8080;
}

const config = {
  apiURL: "http://localhost:" + port,
  facebookAppId: "1221301334742046",
};

export default config;
