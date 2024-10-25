import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RuneCalc from './RuneCalc'
import Navbar from './Navbar'
import './index.css'

createRoot(document.getElementById('root')).render(
  <>
    <Navbar/>
    <RuneCalc/>
  </>
)
