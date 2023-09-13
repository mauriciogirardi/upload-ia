import { fastifyMultipart } from '@fastify/multipart'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import path from 'node:path'
import fs from 'node:fs'
import { prisma } from '../lib/prisma'

const MP3 = '.mp3'
const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fieldSize: 1_048_576 * 25, //25mb
    }
  })

  app.post('/videos', async (request, reply) => {
    const data = await  request.file()

    if(!data) {
      return reply.status(400).send({error: 'Missing file input.'})
    }

    const { filename, file } = data
    const extension = path.extname(filename)

    if(extension !== MP3) {
      return reply.status(400).send({error: 'Invalid input type, please upload a MP3.'})
    }

    const fileBaseName = path.basename(filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
    const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: filename,
        path: uploadDestination
      }

    })

    return reply.send({ video })
  })
}
