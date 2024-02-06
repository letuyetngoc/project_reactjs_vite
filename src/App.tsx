import { Outlet } from "react-router-dom"
import Header from "./component/header/Header"


function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
