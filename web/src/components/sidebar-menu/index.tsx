import { FileVideo, Upload, Wand2 } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Slider } from '../ui/slider'

export function SidebarMenu() {
  return (
    <aside className="w-80 space-y-6">
      <form className="space-y-6">
        <label
          htmlFor="video"
          className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
          >
            Selecione um video
            <FileVideo className="w-4 h-4"/>
        </label>
        <input
          type="file"
          id="video"
          accept="video/mp4"
          className="sr-only"
        />

        <Separator/>

        <div className="space-y-2">
          <Label htmlFor="transcription_prompt">
            Prompt de transcrição
          </Label>
          <Textarea
            id="transcription_prompt"
            className="min-h-[100px] leading-relaxed resize-none"
            placeholder="Inclua palavras mencionadas no vídeo separadas por vírgula (,)"
          />
        </div>

        <Button className="w-full" type="submit">
          Carregar vídeo
          <Upload  className='h-4 w-4 ml-2'/>
        </Button>
      </form>

      <Separator />

      <form className='space-y-6'>
        <div className="space-y-2">
          <Label>Prompt</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um prompt..."/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título do YouTube</SelectItem>
              <SelectItem value="description">Descrição do YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select disabled defaultValue="gpt3.5">
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs block italic text-muted-foreground">
            Você poderá customizar essa opção em breve.
          </span>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Temperatura</Label>
          <Slider
            min={0}
            max={1}
            step={0.1}
          />
          <span className="text-xs block italic text-muted-foreground leading-relaxed">
            Valores mais altos tendem a deixar o resultado mais criativos e com possíveis erros.
          </span>
        </div>

        <Separator />

        <Button type="submit" className="w-full">
          Executar
          <Wand2 className="w-4 h-4 ml-2"/>
        </Button>
      </form>
    </aside>
  )
}
