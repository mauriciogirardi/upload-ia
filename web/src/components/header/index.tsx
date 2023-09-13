import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {Github} from 'lucide-react'


export function Header() {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b">
      <h1 className="text-xl font-bold">upload.ai</h1>
      <div className="flex gap-3 items-center">
        <span className="text-sm text-muted-foreground max-sm:hidden">
          Desenvolvido com 💙 no{' '}
          <a
            className="hover:text-zinc-200 underline -tracking-tight"
            href="https://app.rocketseat.com.br/"
            target="_blank"
            rel="noopener"
          >
            NLW
          </a>
        </span>

        <Separator orientation="vertical" className="h-6 max-sm:hidden"/>

        <Button variant="outline" asChild>
          <a  href="https://github.com/mauriciogirardi" target="_blank"  rel="noopener">
            <Github className="w-4 h-4 mr-2"/>
            <span>Github</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
