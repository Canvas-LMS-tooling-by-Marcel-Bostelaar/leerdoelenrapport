import 'src/App.css'
import { ConfigEditor } from 'src/components/config/ConfigEditor'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StudentOverview } from 'src/components/StudentOverview';
import { NotFound } from './components/NotFound';


function App() {
  return (
    <BrowserRouter>
      <nav style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}> 
        <a href="/">Home</a>
        <a href="/dev/setCourse">Set Course in Session</a>
        <a href="/dev/cache">Cache</a>
        <a href="/students">Students</a>
        <a href="/config">Config</a>
      </nav>
      <Routes>
        <Route path="/" element={<>Home</>}/>
        <Route path="/config" element={<ConfigEditor />}/>
        <Route path="/students" element={<StudentOverview />}/>
        <Route path="/*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
