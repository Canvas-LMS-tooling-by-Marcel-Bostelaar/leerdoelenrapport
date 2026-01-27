import { useEffect, useState } from 'react'
import 'src/App.css'
import { FullConfigToJson, ParseFullConfigJson, type IFullConfig, type ISection } from 'src/types/config'
import type { IOutcomeGrouping } from 'src/types/IOutcomeGrouping'
import { useDerivedState } from 'src/utility/useDerivedState'
import { FullConfig } from 'src/components/config/FullConfig'
import { useUnsavedChangesWarning } from 'src/utility/unsavedChanges'
import './ConfigEditor.css'

type DecoratedIFullConfig = {
  revalidateTodo: boolean,
  config: IFullConfig
}

export function ConfigEditor() {
  const configUrl = "/api/config"
  const revalidateUrl = "/api/config/revalidate"
  const outcomeUrl = "/api/outcomegroups"
  const sectionUrl = "/api/sections"
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useUnsavedChangesWarning(hasUnsavedChanges);
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
    (ds, nc) => {
        setHasUnsavedChanges(true);
        return {...ds, config: nc}
    }
  )
  const [revalidateTodo, setRevalidateTodo] = useDerivedState(decoratedState, setDecorateState,
    ds => ds.revalidateTodo,
    (ds, newbool) => {
        setHasUnsavedChanges(true);
        return {...ds, revalidateTodo: newbool}
    }
  )

  const loadConfig = async () => {
    const response = await fetch(configUrl)
    const json = await response.text()
    setDecorateState({
      revalidateTodo: false,
      config: ParseFullConfigJson(json)
    });
    setHasUnsavedChanges(false);
    setIsLoaded(true);
  }

  const saveConfig = async () => {
    if(fullConfig !== null){
        await fetch(configUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: FullConfigToJson(fullConfig),
        })
        setHasUnsavedChanges(false);
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

  //Fetch needed information.
  useEffect(() => {
    loadOutcomeGrouping();
    loadSections();
    loadConfig();
  }, []);

  //Revalidate if needed.
  useEffect(() => {
    if(revalidateTodo){
      revalidateConfig();
    }
  }, [revalidateTodo])

  return (
    <div>
        <h1 className='ConfigTitle'>Configurations:</h1>
        <button onClick={loadConfig} className='ConfigTitle'>Reload</button>
        <button onClick={saveConfig} className='ConfigTitle'>Save</button>

        {outcomeGrouping === undefined || allSections === undefined || !isLoaded ? <>No config loaded</> : (
            <FullConfig 
            config={fullConfig} 
            setConfig={setFullConfig}
            revalidateConfig={() => setRevalidateTodo(true)}
            outcomeGrouping={outcomeGrouping}
            allSections={allSections}>

            </FullConfig>)}
    </div>
  )
}