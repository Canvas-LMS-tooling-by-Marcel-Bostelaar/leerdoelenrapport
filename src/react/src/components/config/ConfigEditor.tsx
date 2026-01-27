import { useEffect, useState } from 'react'
import 'src/App.css'
import { type IFullConfig, type ISection } from 'src/types/config'
import type { IOutcomeGrouping } from 'src/types/IOutcomeGrouping'
import { useDerivedState } from 'src/utility/useDerivedState'
import { FullConfig } from 'src/components/config/FullConfig'
import { useUnsavedChangesWarning } from 'src/utility/unsavedChanges'
import './ConfigEditor.css'
import { loadConfig, loadOutcomeGrouping, loadSections, revalidateConfig, saveConfig } from '../../utility/apiCalls'

type DecoratedIFullConfig = {
  revalidateTodo: boolean,
  config: IFullConfig
}

export function ConfigEditor() {
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

  const loadConfigInternal = async () => {
    await loadConfig(val => setDecorateState({
      revalidateTodo: false,
      config: val
    }));
    setHasUnsavedChanges(false);
    setIsLoaded(true);
  }

  const saveConfigInternal = async () => {
      await saveConfig(fullConfig);
      setHasUnsavedChanges(false);
  }

  const revalidateConfigInternal = async () => {
    revalidateConfig(fullConfig, (config) =>
    setDecorateState({
      revalidateTodo: false,
      config: config
    }));
  }

  //Fetch needed information.
  useEffect(() => {
    loadOutcomeGrouping(setOutcomeGrouping)
    .then(() => loadSections(setAllSections))
    .then(loadConfigInternal);
  }, []);

  //Revalidate if needed.
  useEffect(() => {
    if(revalidateTodo){
      revalidateConfigInternal();
    }
  }, [revalidateTodo])

  return (
    <div>
        <h1 className='ConfigTitle'>Configurations:</h1>
        <button onClick={loadConfigInternal} className='ConfigTitle'>Reload</button>
        <button onClick={saveConfigInternal} className='ConfigTitle'>Save</button>

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