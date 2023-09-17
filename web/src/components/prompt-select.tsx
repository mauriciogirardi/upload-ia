import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

type Prompts = {
  id: string
  title: string
  template: string
}

type Props = {
  onPromptSelected: (template: string) => void
}

export function PromptSelect({ onPromptSelected }: Props) {
  const [prompts, setPrompts] = useState<Prompts[]>([])

  useEffect(() => {
    api.get<Prompts[]>('/prompts').then(response => {
      setPrompts(response.data)
    }).catch(err => console.error(err))
  }, [])

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts.find(prompt => prompt.id === promptId)
    if (!selectedPrompt) return
    onPromptSelected(selectedPrompt.template)
  }

  return (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Select
        onValueChange={handlePromptSelected}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prompt..."/>
        </SelectTrigger>
        <SelectContent>
          {prompts.map(prompt => (
            <SelectItem
              key={prompt.id}
              value={prompt.id}
            >
              {prompt.title}
            </SelectItem>
          ))}
          <SelectItem disabled value="">
              Criar novo (em breve)
            </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
