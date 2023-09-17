import { CSSProperties, ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Textarea } from '../ui/textarea'
import { FileVideo, Upload } from 'lucide-react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/axios'
import { Loading } from '../Loading'

type Video = {
  createdAt: string
  id: string
  name: string
  path: string
  transcription: string | null
}

type Props = {
  onVideoUploaded: (videoId: string | null) => void
}

type Status = 'waiting' | 'converting' | 'uploading' | 'success' | 'error' | 'generating'

const statusMessaging = {
  converting: 'Convertendo',
  uploading: 'Carregando',
  generating: 'Transcrevendo',
  success: 'Sucesso!',
  error: 'Error ocorrido'
}

export function VideoInputForm({ onVideoUploaded }: Props) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [progressUpload, setProgressUpload] = useState(0)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  async function convertVideoToAudio(video: File) {
    try {
      const ffmpeg = await getFFmpeg()

      await ffmpeg.writeFile('input.mp4', await fetchFile(video))

      ffmpeg.on('progress', progress => {
        setProgressUpload(Math.round(progress.progress * 100))
      })

      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-map',
        '0:a',
        '-b:a',
        '20k',
        '-acodec',
        'libmp3lame',
        'output.mp3'
      ])

      const data = await ffmpeg.readFile('output.mp3')

      const audioFileBlob = new Blob([data], {type: 'audio/mpeg'})
      const audioFile = new File([audioFileBlob], 'audio.mp3', {
        type: 'audio/mpeg'
      })

      setProgressUpload(0)
      return audioFile
    } catch (error) {
      console.error(error)
    }
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if(!files) return

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()

      const prompt = promptInputRef.current?.value

      if (!videoFile) return

      setStatus('converting')
      const audioFile = await convertVideoToAudio(videoFile)

      const data = new FormData()
      data.append('file', audioFile as Blob)

      setStatus('uploading')
      const response = await api.post<{video: Video}>('/videos', data)
      const videoId = response.data.video.id


      setStatus('generating')
      await api.post(`/videos/${videoId}/transcription`, {
        prompt
      })

      setStatus('success')
      onVideoUploaded(videoId)
    } catch (error) {
      console.error(error)
      setStatus('error')
    } finally {
      setStatus('waiting')
    }
  }

  const previewURL = useMemo(() => {
    if(!videoFile) return null
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  const isStartProgressUpload = progressUpload > 0
  const progressBarStyle: CSSProperties = {
    width: `${progressUpload}%`,
  };

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="relative overflow-hidden border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
        >
        {previewURL
          ? (
            <video
              src={previewURL}
              controls={false}
              data-success={status === 'success'}
              className="pointer-events-none absolute inset-0 data-[success=true]:cursor-not-allowed"
            />
          ) : (
            <>
              Selecione um video
              <FileVideo className="w-4 h-4"/>
            </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator/>

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">
          Prompt de transcrição
        </Label>
        <Textarea
          disabled={status !== 'waiting'}
          ref={promptInputRef}
          id="transcription_prompt"
          className="min-h-[100px] leading-relaxed resize-none"
          placeholder="Inclua palavras mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button
        className="w-full relative overflow-hidden data-[success=true]:bg-emerald-400"
        type="submit"
        disabled={status !== 'waiting'}
        data-success={status === 'success'}
      >
        {status === 'waiting' ? 'Carregar vídeo': statusMessaging[status] }
        {status === 'success' ? '' : status !== 'waiting' ? <Loading /> : <Upload  className='h-4 w-4 ml-2'/>}

        {isStartProgressUpload && (
          <div
            style={progressBarStyle}
            className=" transition-all h-1 absolute bottom-0 left-0 bg-emerald-400"
          />
        )}
      </Button>
    </form>
  )
}
