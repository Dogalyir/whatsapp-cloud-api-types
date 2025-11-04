import { z } from 'zod'

/**
 * Configuration schema for WhatsApp Cloud API client
 */
export const WhatsAppConfigSchema = z.object({
	/**
	 * WhatsApp Business Account access token
	 */
	accessToken: z.string().min(1, 'Access token is required'),

	/**
	 * Phone Number ID from WhatsApp Business Account
	 */
	phoneNumberId: z.string().min(1, 'Phone number ID is required'),

	/**
	 * WhatsApp Business Account ID (optional, needed for some endpoints)
	 */
	wabaId: z.string().optional(),

	/**
	 * API version to use (default: v21.0)
	 */
	version: z.string().default('v21.0'),

	/**
	 * Base URL for the API (default: https://graph.facebook.com)
	 */
	baseUrl: z.string().url().default('https://graph.facebook.com'),
})

export type WhatsAppConfig = z.infer<typeof WhatsAppConfigSchema>

/**
 * Standard API response wrapper
 */
export const ApiResponseSchema = z.object({
	messaging_product: z.literal('whatsapp').optional(),
	contacts: z
		.array(
			z.object({
				input: z.string(),
				wa_id: z.string(),
			}),
		)
		.optional(),
	messages: z
		.array(
			z.object({
				id: z.string(),
			}),
		)
		.optional(),
})

export type ApiResponse = z.infer<typeof ApiResponseSchema>

/**
 * Error response from WhatsApp API
 */
export const ApiErrorSchema = z.object({
	error: z.object({
		message: z.string(),
		type: z.string(),
		code: z.number(),
		error_subcode: z.number().optional(),
		fbtrace_id: z.string(),
	}),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

/**
 * Base fetch options
 */
export interface FetchOptions {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
	headers?: Record<string, string>
	body?: string | FormData
}

/**
 * Custom error class for WhatsApp API errors
 */
export class WhatsAppApiError extends Error {
	constructor(
		public code: number,
		message: string,
		public type: string,
		public subcode?: number,
		public fbtraceId?: string,
	) {
		super(message)
		this.name = 'WhatsAppApiError'
	}
}

/**
 * Base service class that all services extend
 */
export class BaseService {
	protected config: WhatsAppConfig

	constructor(config: WhatsAppConfig) {
		this.config = config
	}

	/**
	 * Build the full API URL
	 */
	protected buildUrl(path: string): string {
		return `${this.config.baseUrl}/${this.config.version}/${path}`
	}

	/**
	 * Make an authenticated request to the API
	 */
	protected async request<T>(
		path: string,
		options: Partial<FetchOptions> = {},
	): Promise<T> {
		const url = this.buildUrl(path)
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.config.accessToken}`,
			...options.headers,
		}

		// Only add Content-Type if body is not FormData
		if (options.body && !(options.body instanceof FormData)) {
			headers['Content-Type'] = 'application/json'
		}

		const response = await fetch(url, {
			method: options.method || 'GET',
			headers,
			body: options.body,
		})

		const data = await response.json()

		if (!response.ok) {
			const errorResult = ApiErrorSchema.safeParse(data)
			if (errorResult.success) {
				const error = errorResult.data.error
				throw new WhatsAppApiError(
					error.code,
					error.message,
					error.type,
					error.error_subcode,
					error.fbtrace_id,
				)
			}
			throw new Error(
				`API request failed with status ${response.status}: ${JSON.stringify(data)}`,
			)
		}

		return data as T
	}
}
