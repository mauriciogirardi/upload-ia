import { Header } from "./components/header";
import { SidebarMenu } from "./components/sidebar-menu";
import { Textarea } from "./components/ui/textarea";

export function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <main className="flex-1 flex p-6 gap-6">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-4 h-full">
            <Textarea
              className="resize-none p-4 leading-relaxed h-1/2"
              placeholder="Inclua o prompt para a IA..."
            />
            <Textarea
              className="resize-none p-4 leading-relaxed h-1/2"
              placeholder="Resultado gerado pela IA..."
              readOnly
            />

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável
            <code className="text-blue-400"> {'{transcription}'} </code>
            no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
          </div>
        </div>

        <div className="overflow-y-auto h-calc overflow-x-hidden pb-3 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-400 pr-2">
          <SidebarMenu/>
        </div>
      </main>
    </div>
  )
}
