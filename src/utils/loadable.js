import React, { lazy, Suspense } from "react";

const loadable = (importFunc, { fallback = null } = {}) => {
  const LazyComponent = lazy(importFunc);

  return (props) =>
    React.createElement(
      Suspense,
      { fallback },
      React.createElement(LazyComponent, props)
    );
};

export default loadable;
