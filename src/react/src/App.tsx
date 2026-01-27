import 'src/App.css'
import { ConfigEditor } from './components/config/ConfigEditor'
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <nav style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}> 
        <a href="/">Home</a>
        <a href="/dev/setCourse">Set Course in Session</a>
        <a href="/dev/cache">Cache</a>
        <a href="/api/students">Students</a>
        <a href="/config">Config</a>
      </nav>
      <Routes>
        <Route path="/" element={<>Home</>}/>
        <Route path="/config" element={<ConfigEditor />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
