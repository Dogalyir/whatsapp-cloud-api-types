import { z } from 'zod'
import { BaseService } from '../config'

/**
 * Media upload response schema
 */
export const MediaUploadResponseSchema = z.object({
	id: z.string(),
})

export type MediaUploadResponse = z.infer<typeof MediaUploadResponseSchema>

/**
 * Media URL response schema
 */
export const MediaUrlResponseSchema = z.object({
	messaging_product: z.literal('whatsapp'),
	url: z.string().url(),
	mime_type: z.string(),
	sha256: z.string(),
	file_size: z.number(),
	id: z.string(),
})

export type MediaUrlResponse = z.infer<typeof MediaUrlResponseSchema>

/**
 * Media delete response schema
 */
export const MediaDeleteResponseSchema = z.object({
	success: z.boolean(),
})

export type MediaDeleteResponse = z.infer<typeof MediaDeleteResponseSchema>

/**
 * Media Service
 * Handles all media-related API calls (upload, retrieve, delete)
 */
export class MediaService extends BaseService {
	/**
	 * Upload media file to WhatsApp servers
	 * @param file - File to upload (Buffer, Blob, or File)
	 * @param type - MIME type of the file
	 * @param filename - Optional filename
	 * @returns Media ID
	 */
	async upload(
		file: File | Blob | Buffer,
		type: string,
		filename?: string,
	): Promise<MediaUploadResponse> {
		const formData = new FormData()
		formData.append('messaging_product', 'whatsapp')
		formData.append('type', type)

		// Handle different file types
		if (file instanceof File) {
			formData.append('file', file, filename || file.name)
		} else if (file instanceof Blob) {
			formData.append('file', file, filename || 'file')
		} else if (Buffer.isBuffer(file)) {
			// For Node.js Buffer, convert to Uint8Array then Blob
			const blob = new Blob([new Uint8Array(file)], { type })
			formData.append('file', blob, filename || 'file')
		}

		const response = await this.request<MediaUploadResponse>(
			`${this.config.phoneNumberId}/media`,
			{
				method: 'POST',
				body: formData,
			},
		)

		return MediaUploadResponseSchema.parse(response)
	}

	/**
	 * Get media URL by media ID
	 * @param mediaId - The media ID
	 * @returns Media URL and metadata
	 */
	async getUrl(mediaId: string): Promise<MediaUrlResponse> {
		const response = await this.request<MediaUrlResponse>(mediaId, {
			method: 'GET',
		})

		return MediaUrlResponseSchema.parse(response)
	}

	/**
	 * Download media file from URL
	 * @param url - The media URL (from getUrl)
	 * @returns ArrayBuffer with file content
	 */
	async download(url: string): Promise<ArrayBuffer> {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.config.accessToken}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Failed to download media: ${response.statusText}`)
		}

		return response.arrayBuffer()
	}

	/**
	 * Get media file directly by ID (combines getUrl and download)
	 * @param mediaId - The media ID
	 * @returns Object with metadata and file content
	 */
	async get(
		mediaId: string,
	): Promise<MediaUrlResponse & { content: ArrayBuffer }> {
		const urlResponse = await this.getUrl(mediaId)
		const content = await this.download(urlResponse.url)

		return {
			...urlResponse,
			content,
		}
	}

	/**
	 * Delete media by ID
	 * @param mediaId - The media ID to delete
	 * @returns Success status
	 */
	async delete(mediaId: string): Promise<MediaDeleteResponse> {
		const response = await this.request<MediaDeleteResponse>(mediaId, {
			method: 'DELETE',
		})

		return MediaDeleteResponseSchema.parse(response)
	}

	/**
	 * Upload media from URL
	 * Downloads from URL and uploads to WhatsApp
	 * @param url - URL to download from
	 * @param type - MIME type of the file
	 * @param filename - Optional filename
	 * @returns Media ID
	 */
	async uploadFromUrl(
		url: string,
		type: string,
		filename?: string,
	): Promise<MediaUploadResponse> {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch media from URL: ${response.statusText}`)
		}

		const blob = await response.blob()
		return this.upload(blob, type, filename)
	}
}
