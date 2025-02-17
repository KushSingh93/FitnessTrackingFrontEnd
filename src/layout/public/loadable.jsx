import loadable from "../../utils/loadable";

const Public = loadable(() => import("./container/public"), {
  fallback: null,
});

export default Public;
