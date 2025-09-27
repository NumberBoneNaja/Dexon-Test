import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layout/mainlayout"
import Info from "../page/info/info"


import Testpoint from "../page/testpoint/testpoing"
import AddPipe from "../page/addpip/addpipe"
import EditPipe from "../page/editpip/editpip"
import Cmldetail from "../page/cml/Cml"
import Thickness from "../page/thickness/thickness"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,  
    children: [
      { index: true, element: <Info /> },
      { path: "info", element: <Info /> },
      {
        path: "addpipe",
        element: <AddPipe/>,
      },
      {
        path: "editpip/:id",
        element: <EditPipe/>,
      },
      {
        path: "cml/:id",
        element: <Cmldetail/>,
      },
      {
        path: "testpoint/:id",
        element: <Testpoint/>,
      },
      {
        path: "thickness/:id",
        element: <Thickness/>,
      },
      {
        path: "*",
        element: <div>404</div>,
      }
     
    ],
  },
])
