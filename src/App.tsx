import { Outlet } from "react-router-dom"
import Header from "./component/header/Header"


function App() {
  return (
    <div style={{width:'80%', margin:'0 auto'}}>
      <Header />
      <Outlet />
    </div>
  )
}

export default App
