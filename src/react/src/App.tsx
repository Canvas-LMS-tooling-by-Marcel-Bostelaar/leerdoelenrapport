import { useEffect, useState } from 'react'
import 'src/App.css'
import { FullConfigToJson, ParseFullConfigJson, type IFullConfig, type ISection } from 'src/types/config'
import type { IOutcomeGrouping } from 'src/types/IOutcomeGrouping'
import { useDerivedState } from 'src/utility/useDerivedState'
import { FullConfig } from 'src/components/config/FullConfig'

type DecoratedIFullConfig = {
  revalidateTodo: boolean,
  config: IFullConfig
}

function App() {
  const configUrl = "/api/config"
  const revalidateUrl = "/api/config/revalidate"
  const outcomeUrl = "/api/outcomes"
  const sectionUrl = "/api/sections"
  const [jsonBody, setJsonBody] = useState('');
  const [outcomeGrouping, setOutcomeGrouping] = useState<IOutcomeGrouping|undefined>(undefined);
  const [allSections, setAllSections] = useState<ISection[]|undefined>(undefined);
  const [decoratedState, setDecorateState] = useState<DecoratedIFullConfig>({
    revalidateTodo: false,
    config: {
      groupingConfigs: []
    }
  });
  const [fullConfig, setFullConfig] = useDerivedState(decoratedState, setDecorateState,
    ds => ds.config,
    (ds, nc) => {return {...ds, config: nc}}
  )
  const [revalidateTodo, setRevalidateTodo] = useDerivedState(decoratedState, setDecorateState,
    ds => ds.revalidateTodo,
    (ds, newbool) => {return {...ds, revalidateTodo: newbool}}
  )

  const loadConfig = async () => {
    const response = await fetch(configUrl)
    const json = await response.text()
    setDecorateState({
      revalidateTodo: false,
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

  const revalidateConfig = async () => {
    let response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: FullConfigToJson(fullConfig),
    });
    const json = await response.text()
    setDecorateState({
      revalidateTodo: false,
      config: ParseFullConfigJson(json)
    });
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

  const loadSections = async () => {
    const response = await fetch(sectionUrl)
    const json = await response.text()
    const parsed = JSON.parse(json) as ISection[];
    setAllSections(parsed);
  }

  useEffect(jsonEffect, [fullConfig]);
  useEffect(() => {
    loadOutcomeGrouping();
    loadSections();
  }, []);
  useEffect(() => {
    if(revalidateTodo){
      revalidateConfig();
    }
  }, [revalidateTodo])

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

      {outcomeGrouping === undefined || allSections === undefined ? <>No config loaded</> : (
        <FullConfig 
        config={fullConfig} 
        setConfig={setFullConfig}
        revalidateConfig={() => setRevalidateTodo(true)}
        outcomeGrouping={outcomeGrouping}
        allSections={allSections}>

        </FullConfig>)}
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
