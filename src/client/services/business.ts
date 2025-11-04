import { z } from 'zod'
import { BaseService } from '../config'

/**
 * Business Profile schema
 */
export const BusinessProfileSchema = z.object({
	about: z.string().max(256).optional(),
	address: z.string().max(256).optional(),
	description: z.string().max(512).optional(),
	email: z.string().email().optional(),
	messaging_product: z.literal('whatsapp'),
	profile_picture_url: z.string().url().optional(),
	websites: z.array(z.string().url()).max(2).optional(),
	vertical: z
		.enum([
			'AUTOMOTIVE',
			'BEAUTY',
			'APPAREL',
			'EDU',
			'ENTERTAIN',
			'EVENT_PLAN',
			'FINANCE',
			'GROCERY',
			'GOVT',
			'HOTEL',
			'HEALTH',
			'NONPROFIT',
			'PROF_SERVICES',
			'RETAIL',
			'TRAVEL',
			'RESTAURANT',
			'NOT_A_BIZ',
		])
		.optional(),
})

export type BusinessProfile = z.infer<typeof BusinessProfileSchema>

/**
 * Business Profile response schema
 */
export const BusinessProfileResponseSchema = z.object({
	data: z.array(BusinessProfileSchema),
})

export type BusinessProfileResponse = z.infer<
	typeof BusinessProfileResponseSchema
>

/**
 * Update Business Profile response schema
 */
export const UpdateBusinessProfileResponseSchema = z.object({
	success: z.boolean(),
})

export type UpdateBusinessProfileResponse = z.infer<
	typeof UpdateBusinessProfileResponseSchema
>

/**
 * Commerce Settings schema
 */
export const CommerceSettingsSchema = z.object({
	is_catalog_visible: z.boolean().optional(),
	is_cart_enabled: z.boolean().optional(),
})

export type CommerceSettings = z.infer<typeof CommerceSettingsSchema>

/**
 * Commerce Settings response schema
 */
export const CommerceSettingsResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			is_catalog_visible: z.boolean(),
			is_cart_enabled: z.boolean(),
		}),
	),
})

export type CommerceSettingsResponse = z.infer<
	typeof CommerceSettingsResponseSchema
>

/**
 * Phone Number Info schema
 */
export const PhoneNumberInfoSchema = z.object({
	verified_name: z.string(),
	display_phone_number: z.string(),
	quality_rating: z.enum(['GREEN', 'YELLOW', 'RED', 'UNKNOWN']),
	id: z.string(),
})

export type PhoneNumberInfo = z.infer<typeof PhoneNumberInfoSchema>

/**
 * Business Service
 * Handles business profile and settings management
 */
export class BusinessService extends BaseService {
	/**
	 * Get business profile information
	 * @param fields - Optional array of fields to retrieve
	 * @returns Business profile data
	 */
	async getProfile(fields?: string[]): Promise<BusinessProfileResponse> {
		const fieldsParam =
			fields?.join(',') ||
			'about,address,description,email,profile_picture_url,websites,vertical'
		const response = await this.request<BusinessProfileResponse>(
			`${this.config.phoneNumberId}/whatsapp_business_profile?fields=${fieldsParam}`,
			{
				method: 'GET',
			},
		)

		return BusinessProfileResponseSchema.parse(response)
	}

	/**
	 * Update business profile
	 * @param profile - Business profile data to update
	 * @returns Success status
	 */
	async updateProfile(
		profile: Partial<BusinessProfile>,
	): Promise<UpdateBusinessProfileResponse> {
		const payload = {
			messaging_product: 'whatsapp',
			...profile,
		}

		const response = await this.request<UpdateBusinessProfileResponse>(
			`${this.config.phoneNumberId}/whatsapp_business_profile`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return UpdateBusinessProfileResponseSchema.parse(response)
	}

	/**
	 * Get commerce settings
	 * @returns Commerce settings
	 */
	async getCommerceSettings(): Promise<CommerceSettingsResponse> {
		if (!this.config.wabaId) {
			throw new Error('wabaId is required to get commerce settings')
		}

		const response = await this.request<CommerceSettingsResponse>(
			`${this.config.wabaId}/whatsapp_commerce_settings?fields=is_catalog_visible,is_cart_enabled`,
			{
				method: 'GET',
			},
		)

		return CommerceSettingsResponseSchema.parse(response)
	}

	/**
	 * Update commerce settings
	 * @param settings - Commerce settings to update
	 * @returns Success status
	 */
	async updateCommerceSettings(
		settings: CommerceSettings,
	): Promise<UpdateBusinessProfileResponse> {
		if (!this.config.wabaId) {
			throw new Error('wabaId is required to update commerce settings')
		}

		const response = await this.request<UpdateBusinessProfileResponse>(
			`${this.config.wabaId}/whatsapp_commerce_settings`,
			{
				method: 'POST',
				body: JSON.stringify(settings),
			},
		)

		return UpdateBusinessProfileResponseSchema.parse(response)
	}

	/**
	 * Get phone number information
	 * @returns Phone number info
	 */
	async getPhoneNumberInfo(): Promise<PhoneNumberInfo> {
		const response = await this.request<PhoneNumberInfo>(
			`${this.config.phoneNumberId}?fields=verified_name,display_phone_number,quality_rating`,
			{
				method: 'GET',
			},
		)

		return PhoneNumberInfoSchema.parse(response)
	}

	/**
	 * Register phone number
	 * @param pin - Two-step verification PIN
	 * @returns Success status
	 */
	async registerPhoneNumber(pin: string): Promise<{ success: boolean }> {
		const payload = {
			messaging_product: 'whatsapp',
			pin,
		}

		return this.request<{ success: boolean }>(
			`${this.config.phoneNumberId}/register`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)
	}

	/**
	 * Deregister phone number
	 * @returns Success status
	 */
	async deregisterPhoneNumber(): Promise<{ success: boolean }> {
		return this.request<{ success: boolean }>(
			`${this.config.phoneNumberId}/deregister`,
			{
				method: 'POST',
			},
		)
	}
}
