// App.tsx
import { Outlet } from 'react-router-dom';

import './App.css'

function App() {


  return (
    <>
      {/* Your navigation/header components */}
      <Outlet />
      {/* Your footer components */}
    </>
  )
}

export default App
