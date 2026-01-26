import 'src/App.css'
import { ConfigEditor } from './components/config/ConfigEditor'


function App() {
  return (
    <div> 
      <a href="/dev/setCourse">Set Course in Session</a>
      <br></br>
      <a href="/dev/cache">Cache</a>
      <br></br>
      <a href="/api/students">Students</a>
      <br></br>
      <ConfigEditor />
    </div>
  )
}

export default App
