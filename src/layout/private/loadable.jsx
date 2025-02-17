import loadable from "../../utils/loadable";

const Private = loadable(() => import("./container/private"), {
  fallback: null,
});

export default Private;
