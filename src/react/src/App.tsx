import { useState } from 'react'
import './App.css'

function App() {
  const url = "/api/config"
  const [body, setBody] = useState('')

  const loadJson = async () => {
    const response = await fetch(url)
    const json = await response.json()
    setBody(JSON.stringify(json, null, 2))
  }

  const sendJson = async () => {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
  }

  return (
    <div> 
      <a href="/setCourse">Set Course in Session</a>
      <br></br>
      <a href="/cache">Cache</a>
      <br></br>
      <div>
        <button onClick={loadJson}>Load (GET)</button>
        <button onClick={sendJson}>Send (POST)</button>
      </div>

      <div>
        <div>Body</div>
        <textarea rows={18} value={body} onChange={(event) => setBody(event.target.value)} />
      </div>
    </div>
  )
}

export default App
