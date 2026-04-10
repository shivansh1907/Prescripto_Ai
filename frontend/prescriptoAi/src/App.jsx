import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Route,Routes } from 'react-router-dom'
import ServerError from './pages/error'

import Home from './pages/home'

function App() {
  

  return (
    <div className='h-full w-full '>

     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/error' element={<ServerError />} />
     </Routes>
     
    </div>
  )
}

export default App
