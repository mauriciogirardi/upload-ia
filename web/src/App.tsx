import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { Textarea } from "./components/ui/textarea";
import { Separator } from "./components/ui/separator";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { PromptSelect } from "./components/prompt-select";
import { VideoInputForm } from "./components/forms/video-input-form";
import { useCompletion } from "ai/react";
import { Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Loading } from "./components/Loading";
import { Slider } from "./components/ui/slider";
import { api } from "./lib/axios";

type Videos = {
  id: string
  name: string
  path: string
  transcription: string
}

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videos, setVideos] = useState<Videos[]>([])

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-type': 'application/json'
    }
  })


  useEffect(() => {
    api.get('/videos').then(response => {
      setVideos(response.data)
    }).catch(err => console.error(err))
  }, [setVideos])

  const handleChangeVideo = (videoId: string) => {
    setVideoId(videoId)
  }

  const hasVideo = videos.length > 0

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 flex p-6 gap-6">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-4 h-full">
            <Textarea
              className="resize-none p-4 leading-relaxed h-1/2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-400"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed h-1/2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-400"
              placeholder="Resultado gerado pela IA..."
              readOnly
              value={completion}
            />

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável
            <code className="text-blue-400"> {'{transcription}'} </code>
            no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
          </div>
        </div>

        <div className="overflow-y-auto h-calc overflow-x-hidden pb-3 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-400 pr-2">
          <aside className="w-80 max-md:w-64 space-y-6 h-screen px-2">
            <VideoInputForm onVideoUploaded={setVideoId} />

            <Separator />

            <div className="space-y-2">
              <Label>Transcrição</Label>
              <Select
                disabled={!hasVideo}
                onValueChange={handleChangeVideo}
              >
                <SelectTrigger>
                  <SelectValue placeholder={hasVideo ? "Selecione um transcrição..." : "Você não tem transcrição ainda!"}/>
                </SelectTrigger>
                <SelectContent>
                  {videos.map((video) => (
                    <SelectItem key={video.id} value={video.id}>
                      {video.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs block italic text-muted-foreground">
                Você pode acessar videos antigos já com transcrição.
              </span>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <PromptSelect
                onPromptSelected={setInput}
              />

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
                <div className="flex items-center justify-between text-sm font-medium">
                  <Label>Temperatura</Label>
                  <span>{temperature}</span>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={value => setTemperature(value[0])}
                />
                <span className="text-xs block italic text-muted-foreground leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativos e com possíveis erros.
                </span>
              </div>

              <Separator />

              <Button type="submit" className="w-full" disabled={isLoading || !videoId}>
                Executar
                {isLoading ? <Loading /> : <Wand2 className="w-4 h-4 ml-2"/>}
              </Button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  )
}
