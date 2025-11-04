import { z } from 'zod'
import { BaseService } from '../config'

/**
 * QR code creation schema
 */
export const CreateQRCodeSchema = z.object({
	prefilled_message: z.string().max(1000).optional(),
	generate_qr_image: z.enum(['PNG', 'SVG']).optional(),
})

export type CreateQRCode = z.infer<typeof CreateQRCodeSchema>

/**
 * QR code response schema
 */
export const QRCodeResponseSchema = z.object({
	code: z.string(),
	prefilled_message: z.string().optional(),
	deep_link_url: z.string().url(),
	qr_image_url: z.string().url().optional(),
})

export type QRCodeResponse = z.infer<typeof QRCodeResponseSchema>

/**
 * QR code list response schema
 */
export const QRCodeListResponseSchema = z.object({
	data: z.array(
		z.object({
			code: z.string(),
			prefilled_message: z.string().optional(),
			deep_link_url: z.string().url(),
		}),
	),
})

export type QRCodeListResponse = z.infer<typeof QRCodeListResponseSchema>

/**
 * QR code update schema
 */
export const UpdateQRCodeSchema = z.object({
	prefilled_message: z.string().max(1000),
})

export type UpdateQRCode = z.infer<typeof UpdateQRCodeSchema>

/**
 * QR code delete response schema
 */
export const QRCodeDeleteResponseSchema = z.object({
	success: z.boolean(),
})

export type QRCodeDeleteResponse = z.infer<typeof QRCodeDeleteResponseSchema>

/**
 * QR Codes Service
 *
 * Service for managing WhatsApp QR codes.
 * QR codes allow users to start conversations by scanning a code.
 *
 * @example
 * ```typescript
 * // Create a QR code
 * const qrCode = await client.qrCodes.create({
 *   prefilled_message: 'Hello!',
 *   generate_qr_image: 'PNG'
 * })
 *
 * // List all QR codes
 * const codes = await client.qrCodes.list()
 *
 * // Get a specific QR code
 * const code = await client.qrCodes.get('qr-code-id')
 *
 * // Update a QR code
 * await client.qrCodes.update('qr-code-id', {
 *   prefilled_message: 'New message'
 * })
 *
 * // Delete a QR code
 * await client.qrCodes.delete('qr-code-id')
 * ```
 */
export class QRCodesService extends BaseService {
	/**
	 * Create a new QR code
	 *
	 * @param options - QR code creation options
	 * @returns QR code response with code and deep link
	 *
	 * @example
	 * ```typescript
	 * const qrCode = await client.qrCodes.create({
	 *   prefilled_message: 'Hi, I need help with my order',
	 *   generate_qr_image: 'PNG'
	 * })
	 * console.log(qrCode.qr_image_url)
	 * ```
	 */
	async create(
		options?: z.input<typeof CreateQRCodeSchema>,
	): Promise<QRCodeResponse> {
		const validatedOptions = options
			? CreateQRCodeSchema.parse(options)
			: undefined

		const response = await this.request<QRCodeResponse>(
			`${this.config.phoneNumberId}/message_qrdls`,
			{
				method: 'POST',
				body: validatedOptions ? JSON.stringify(validatedOptions) : undefined,
			},
		)

		return QRCodeResponseSchema.parse(response)
	}

	/**
	 * List all QR codes
	 *
	 * @returns List of QR codes
	 *
	 * @example
	 * ```typescript
	 * const codes = await client.qrCodes.list()
	 * for (const code of codes.data) {
	 *   console.log(code.code, code.deep_link_url)
	 * }
	 * ```
	 */
	async list(): Promise<QRCodeListResponse> {
		const response = await this.request<QRCodeListResponse>(
			`${this.config.phoneNumberId}/message_qrdls`,
			{
				method: 'GET',
			},
		)

		return QRCodeListResponseSchema.parse(response)
	}

	/**
	 * Get a specific QR code
	 *
	 * @param qrCodeId - QR code ID
	 * @returns QR code details
	 *
	 * @example
	 * ```typescript
	 * const code = await client.qrCodes.get('abc123')
	 * console.log(code.deep_link_url)
	 * ```
	 */
	async get(qrCodeId: string): Promise<QRCodeResponse> {
		const response = await this.request<QRCodeResponse>(
			`${this.config.phoneNumberId}/message_qrdls/${qrCodeId}`,
			{
				method: 'GET',
			},
		)

		return QRCodeResponseSchema.parse(response)
	}

	/**
	 * Update a QR code's prefilled message
	 *
	 * @param qrCodeId - QR code ID
	 * @param updates - Updates to apply
	 * @returns Success response
	 *
	 * @example
	 * ```typescript
	 * await client.qrCodes.update('abc123', {
	 *   prefilled_message: 'Updated message'
	 * })
	 * ```
	 */
	async update(
		qrCodeId: string,
		updates: z.input<typeof UpdateQRCodeSchema>,
	): Promise<{ success: boolean }> {
		const validatedUpdates = UpdateQRCodeSchema.parse(updates)

		const response = await this.request<{ success: boolean }>(
			`${this.config.phoneNumberId}/message_qrdls/${qrCodeId}`,
			{
				method: 'POST',
				body: JSON.stringify(validatedUpdates),
			},
		)

		return response
	}

	/**
	 * Delete a QR code
	 *
	 * @param qrCodeId - QR code ID
	 * @returns Deletion response
	 *
	 * @example
	 * ```typescript
	 * await client.qrCodes.delete('abc123')
	 * ```
	 */
	async delete(qrCodeId: string): Promise<QRCodeDeleteResponse> {
		const response = await this.request<QRCodeDeleteResponse>(
			`${this.config.phoneNumberId}/message_qrdls/${qrCodeId}`,
			{
				method: 'DELETE',
			},
		)

		return QRCodeDeleteResponseSchema.parse(response)
	}

	/**
	 * Get QR code image URL
	 *
	 * @param qrCodeId - QR code ID
	 * @param format - Image format (PNG or SVG)
	 * @returns QR code with image URL
	 *
	 * @example
	 * ```typescript
	 * const qrCode = await client.qrCodes.getImage('abc123', 'PNG')
	 * console.log(qrCode.qr_image_url)
	 * ```
	 */
	async getImage(
		qrCodeId: string,
		format: 'PNG' | 'SVG' = 'PNG',
	): Promise<QRCodeResponse> {
		const params = new URLSearchParams({
			generate_qr_image: format,
		})

		const response = await this.request<QRCodeResponse>(
			`${this.config.phoneNumberId}/message_qrdls/${qrCodeId}?${params.toString()}`,
			{
				method: 'GET',
			},
		)

		return QRCodeResponseSchema.parse(response)
	}
}
