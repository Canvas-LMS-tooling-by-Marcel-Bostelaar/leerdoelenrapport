import { useEffect, useState } from 'react'
import './App.css'
import { FullConfig } from './components/outcomes/FullConfig'
import { FullConfigToJson, ParseFullConfigJson, type IFullConfig } from './types/config'
import type { IOutcomeGrouping } from './types/IOutcomeGrouping'
import { useDerivedState } from './utility/useDerivedState'

type DecoratedIFullConfig = {
  saveAndReloadTodo: boolean,
  config: IFullConfig
}

function App() {
  const configUrl = "/api/config"
  const outcomeUrl = "/api/outcomes"
  const [jsonBody, setJsonBody] = useState('');
  const [outcomeGrouping, setOutcomeGrouping] = useState<IOutcomeGrouping|undefined>(undefined);
  const [decoratedState, setDecorateState] = useState<DecoratedIFullConfig>({
    saveAndReloadTodo: false,
    config: {
      groupingConfigs: []
    }
  });
  const [fullConfig, setFullConfig] = useDerivedState(decoratedState, setDecorateState,
    ds => ds.config,
    (ds, nc) => {return {...ds, config: nc}}
  )
  const [saveAndReloadTodo, setSaveAndReloadTodo] = useDerivedState(decoratedState, setDecorateState,
    ds => ds.saveAndReloadTodo,
    (ds, newbool) => {return {...ds, saveAndReloadTodo: newbool}}
  )

  const loadConfig = async () => {
    const response = await fetch(configUrl)
    const json = await response.text()
    setDecorateState({
      saveAndReloadTodo: false,
      config: ParseFullConfigJson(json)
    });
  }

  const saveConfig = async () => {
    if(fullConfig !== null){
      await fetch(configUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: FullConfigToJson(fullConfig),
      })
    }
  }

  const jsonEffect = () => {
    if(fullConfig != null){
      setJsonBody(FullConfigToJson(fullConfig, true))
    }
  }

  const loadOutcomeGrouping = async () => {
    const response = await fetch(outcomeUrl)
    const json = await response.text()
    const parsed = JSON.parse(json) as IOutcomeGrouping;
    setOutcomeGrouping(parsed);
  }

  useEffect(jsonEffect, [fullConfig]);
  useEffect(() => {
    loadOutcomeGrouping();
  }, []);
  useEffect(() => {
    if(saveAndReloadTodo){
      saveConfig().then(loadConfig)
    }
  }, [saveAndReloadTodo])

  return (
    <div> 
      <a href="/dev/setCourse">Set Course in Session</a>
      <br></br>
      <a href="/dev/cache">Cache</a>
      <br></br>
      <div>
        <button onClick={loadConfig}>Load (GET)</button>
        <button onClick={saveConfig}>Send (POST)</button>
      </div>

      {outcomeGrouping === undefined ? <>No config loaded</> : (
        <FullConfig 
        config={fullConfig} 
        setConfig={setFullConfig}
        saveAndReloadConfig={() => setSaveAndReloadTodo(true)}
        outcomeGrouping={outcomeGrouping}></FullConfig>)}
      <div>
        <div>Body</div>
        <pre>
          {jsonBody}
        </pre>
      </div>
    </div>
  )
}

export default App
