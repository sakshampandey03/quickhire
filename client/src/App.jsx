import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'

function App() {
    return (
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='apply-job/:id' element={<ApplyJob/>}></Route>
        <Route path='application' element = {<Application/>}></Route>
      </Routes>
    )
}

export default App
