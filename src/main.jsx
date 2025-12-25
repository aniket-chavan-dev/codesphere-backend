import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Layout from "./pages/Layout.jsx";
import Login from "./pages/Login.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Home from "./pages/Home.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import Hello from "./pages/Hello.jsx";
import Description from "./components/description/Description.jsx";
import Submissions from "./components/submissions/Submissions.jsx";
import SolutionPost from "./pages/SolutionPost.jsx";
import MarkdownHelper from "./pages/MarkdownHelper.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user/register",
        element: <Register />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/problems/:title",
    element: <ProblemPage />,
  },
  {
    path: "/problems/:id/solution-post",
    element: <SolutionPost />,
  },
  {
    path: "/markdown-helper",
    element: <MarkdownHelper />,
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
