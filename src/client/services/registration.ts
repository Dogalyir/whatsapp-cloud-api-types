import { z } from 'zod'
import { BaseService } from '../config'

/**
 * Phone number registration schema
 */
export const PhoneNumberRegistrationSchema = z.object({
	messaging_product: z.literal('whatsapp'),
	pin: z.string().length(6),
})

export type PhoneNumberRegistration = z.infer<
	typeof PhoneNumberRegistrationSchema
>

/**
 * Phone number registration response schema
 */
export const PhoneNumberRegistrationResponseSchema = z.object({
	success: z.boolean(),
})

export type PhoneNumberRegistrationResponse = z.infer<
	typeof PhoneNumberRegistrationResponseSchema
>

/**
 * Phone number info schema
 */
export const PhoneNumberInfoSchema = z.object({
	id: z.string(),
	verified_name: z.string(),
	display_phone_number: z.string(),
	quality_rating: z.enum(['GREEN', 'YELLOW', 'RED', 'UNKNOWN']),
	platform_type: z.enum(['CLOUD_API', 'NOT_APPLICABLE']),
	throughput: z.object({
		level: z.enum(['STANDARD', 'HIGH', 'VERY_HIGH', 'UNLIMITED']),
	}),
	webhook_configuration: z
		.object({
			application: z.string().optional(),
			whatsapp_business_account: z.string().optional(),
		})
		.optional(),
	last_onboarded_time: z.string().optional(),
	code_verification_status: z
		.enum(['VERIFIED', 'NOT_VERIFIED', 'EXPIRED'])
		.optional(),
	account_mode: z.enum(['SANDBOX', 'LIVE']).optional(),
	certificate: z.string().optional(),
	name_status: z
		.enum([
			'APPROVED',
			'AVAILABLE_WITHOUT_REVIEW',
			'DECLINED',
			'PENDING_REVIEW',
			'NONE',
		])
		.optional(),
	new_name_status: z
		.enum([
			'APPROVED',
			'AVAILABLE_WITHOUT_REVIEW',
			'DECLINED',
			'PENDING_REVIEW',
			'NONE',
		])
		.optional(),
	status: z
		.enum([
			'CONNECTED',
			'DISCONNECTED',
			'DELETED',
			'MIGRATED',
			'BANNED',
			'RESTRICTED',
			'RATE_LIMITED',
			'FLAGGED',
			'PENDING',
		])
		.optional(),
	is_official_business_account: z.boolean().optional(),
})

export type PhoneNumberInfo = z.infer<typeof PhoneNumberInfoSchema>

/**
 * Phone number settings schema
 */
export const PhoneNumberSettingsSchema = z.object({
	messaging_product: z.literal('whatsapp'),
	pin: z.string().length(6).optional(),
})

export type PhoneNumberSettings = z.infer<typeof PhoneNumberSettingsSchema>

/**
 * Deregister phone number schema
 */
export const DeregisterPhoneNumberSchema = z.object({
	success: z.boolean(),
})

export type DeregisterPhoneNumberResponse = z.infer<
	typeof DeregisterPhoneNumberSchema
>

/**
 * Request code schema
 */
export const RequestCodeSchema = z.object({
	code_method: z.enum(['SMS', 'VOICE']),
	language: z.string().optional().default('en_US'),
})

export type RequestCode = z.infer<typeof RequestCodeSchema>

/**
 * Request code response schema
 */
export const RequestCodeResponseSchema = z.object({
	success: z.boolean(),
})

export type RequestCodeResponse = z.infer<typeof RequestCodeResponseSchema>

/**
 * Verify code schema
 */
export const VerifyCodeSchema = z.object({
	code: z.string(),
})

export type VerifyCode = z.infer<typeof VerifyCodeSchema>

/**
 * Verify code response schema
 */
export const VerifyCodeResponseSchema = z.object({
	success: z.boolean(),
})

export type VerifyCodeResponse = z.infer<typeof VerifyCodeResponseSchema>

/**
 * Registration Service
 *
 * Service for managing phone number registration and settings.
 * This includes registering phone numbers, managing PINs, and verification.
 *
 * @example
 * ```typescript
 * // Register a phone number
 * await client.registration.register('123456')
 *
 * // Get phone number info
 * const info = await client.registration.getInfo()
 *
 * // Request verification code
 * await client.registration.requestCode('SMS')
 *
 * // Verify code
 * await client.registration.verifyCode('123456')
 *
 * // Deregister phone number
 * await client.registration.deregister()
 * ```
 */
export class RegistrationService extends BaseService {
	/**
	 * Register a phone number
	 *
	 * @param pin - 6-digit PIN for the phone number
	 * @returns Registration response
	 *
	 * @example
	 * ```typescript
	 * await client.registration.register('123456')
	 * ```
	 */
	async register(pin: string): Promise<PhoneNumberRegistrationResponse> {
		const payload = PhoneNumberRegistrationSchema.parse({
			messaging_product: 'whatsapp',
			pin,
		})

		const response = await this.request<PhoneNumberRegistrationResponse>(
			`${this.config.phoneNumberId}/register`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return PhoneNumberRegistrationResponseSchema.parse(response)
	}

	/**
	 * Deregister a phone number
	 *
	 * @returns Deregistration response
	 *
	 * @example
	 * ```typescript
	 * await client.registration.deregister()
	 * ```
	 */
	async deregister(): Promise<DeregisterPhoneNumberResponse> {
		const response = await this.request<DeregisterPhoneNumberResponse>(
			`${this.config.phoneNumberId}/deregister`,
			{
				method: 'POST',
			},
		)

		return DeregisterPhoneNumberSchema.parse(response)
	}

	/**
	 * Get phone number information
	 *
	 * @param fields - Optional array of fields to retrieve
	 * @returns Phone number information
	 *
	 * @example
	 * ```typescript
	 * const info = await client.registration.getInfo()
	 * console.log(info.quality_rating)
	 * ```
	 */
	async getInfo(fields?: string[]): Promise<PhoneNumberInfo> {
		const params = new URLSearchParams()

		if (fields && fields.length > 0) {
			params.append('fields', fields.join(','))
		} else {
			// Default fields
			params.append(
				'fields',
				'id,verified_name,display_phone_number,quality_rating,platform_type,throughput,webhook_configuration,last_onboarded_time,code_verification_status,account_mode,certificate,name_status,new_name_status,status,is_official_business_account',
			)
		}

		const response = await this.request<PhoneNumberInfo>(
			`${this.config.phoneNumberId}?${params.toString()}`,
			{
				method: 'GET',
			},
		)

		return PhoneNumberInfoSchema.parse(response)
	}

	/**
	 * Request a verification code
	 *
	 * @param codeMethod - Method to receive code (SMS or VOICE)
	 * @param language - Language for the code (default: en_US)
	 * @returns Request code response
	 *
	 * @example
	 * ```typescript
	 * await client.registration.requestCode('SMS', 'en_US')
	 * ```
	 */
	async requestCode(
		codeMethod: 'SMS' | 'VOICE',
		language = 'en_US',
	): Promise<RequestCodeResponse> {
		const payload = RequestCodeSchema.parse({
			code_method: codeMethod,
			language,
		})

		const response = await this.request<RequestCodeResponse>(
			`${this.config.phoneNumberId}/request_code`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return RequestCodeResponseSchema.parse(response)
	}

	/**
	 * Verify a code received via SMS or VOICE
	 *
	 * @param code - Verification code
	 * @returns Verification response
	 *
	 * @example
	 * ```typescript
	 * await client.registration.verifyCode('123456')
	 * ```
	 */
	async verifyCode(code: string): Promise<VerifyCodeResponse> {
		const payload = VerifyCodeSchema.parse({ code })

		const response = await this.request<VerifyCodeResponse>(
			`${this.config.phoneNumberId}/verify_code`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return VerifyCodeResponseSchema.parse(response)
	}

	/**
	 * Update phone number settings (e.g., change PIN)
	 *
	 * @param settings - Settings to update
	 * @returns Success response
	 *
	 * @example
	 * ```typescript
	 * await client.registration.updateSettings({ pin: '654321' })
	 * ```
	 */
	async updateSettings(
		settings: z.input<typeof PhoneNumberSettingsSchema>,
	): Promise<{ success: boolean }> {
		const payload = {
			messaging_product: 'whatsapp' as const,
			...(settings.pin && { pin: settings.pin }),
		}

		const response = await this.request<{ success: boolean }>(
			this.config.phoneNumberId,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return response
	}
}
