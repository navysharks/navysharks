import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Destinations } from "./pages/Destinations";
import { Membership } from "./pages/Membership";
import { Partners } from "./pages/Partners";
import { Contact } from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "destinations", Component: Destinations },
      { path: "membership", Component: Membership },
      { path: "partners", Component: Partners },
      { path: "contact", Component: Contact },
    ],
  },
]);
