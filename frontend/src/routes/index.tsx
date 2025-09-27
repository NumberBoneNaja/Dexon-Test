import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layout/mainlayout"
import Info from "../page/info/info"
import Cml from "../page/cml/Cml"

import Testpoint from "../page/testpoint/testpoing"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,  
    children: [
      { index: true, element: <Info /> },
      { path: "info", element: <Info /> },
      {
        path: "cml",
        element: <Cml/>,
      },
      {
        path: "testpoint",
        element: <Testpoint/>,
      },
      {
        path: "thickness",
        element: <div>Thickness</div>,
      },
      {
        path: "*",
        element: <div>404</div>,
      }
     
    ],
  },
])
