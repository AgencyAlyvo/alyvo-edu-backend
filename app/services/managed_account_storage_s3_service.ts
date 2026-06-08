import type { Readable } from 'stream'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'
import type { HttpContext } from '@adonisjs/core/http'
import type { ObjectMetaData } from '@adonisjs/drive/types'
import NotFoundException from '#exceptions/not_found_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

/**
 * Stockage S3 des captures et assets lies aux comptes geres.
 */
export default class ManagedAccountStorageS3Service {
  /**
   * Envoie un buffer vers S3.
   */
  public static async putBuffer(key: string, buffer: Buffer, contentType: string): Promise<void> {
    try {
      await drive.use().put(key, buffer, { contentType })
    } catch (error: unknown) {
      logger.error({ err: error, key }, 'Error uploading managed account buffer to S3')
      throw new InternalServerErrorException('Error while uploading managed account file')
    }
  }

  /**
   * Supprime un objet S3 s'il existe (ignore si absent).
   */
  public static async deleteIfExists(key: string): Promise<void> {
    try {
      if (await drive.use().exists(key)) {
        await drive.use().delete(key)
      }
    } catch (error: unknown) {
      logger.error({ err: error, key }, 'Error deleting managed account file from S3')
      throw new InternalServerErrorException('Error while deleting managed account file')
    }
  }

  /**
   * Stream une capture myBC vers le client.
   */
  public static async streamDownload(ctx: HttpContext, key: string, downloadName: string): Promise<void> {
    try {
      if (!(await drive.use().exists(key))) {
        throw new NotFoundException('Screenshot not found')
      }

      const meta: ObjectMetaData = await drive.use().getMetaData(key)
      const fileStream: Readable = await drive.use().getStream(key)

      ctx.response.response.setHeader('Content-Type', 'image/png')
      ctx.response.response.setHeader('Access-Control-Allow-Origin', '*')
      ctx.response.response.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`)
      ctx.response.response.setHeader('Content-Length', meta.contentLength.toString())

      return ctx.response.stream(fileStream)
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error
      }

      logger.error({ err: error, key }, 'Error streaming managed account screenshot')
      throw new InternalServerErrorException('Error while downloading screenshot')
    }
  }
}
