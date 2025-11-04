import { z } from 'zod'
import { BaseService } from '../config'

/**
 * Two-step verification PIN schema
 */
export const TwoStepVerificationPinSchema = z.object({
	pin: z.string().length(6, 'PIN must be exactly 6 digits'),
})

export type TwoStepVerificationPin = z.infer<
	typeof TwoStepVerificationPinSchema
>

/**
 * Two-step verification response schema
 */
export const TwoStepVerificationResponseSchema = z.object({
	success: z.boolean(),
})

export type TwoStepVerificationResponse = z.infer<
	typeof TwoStepVerificationResponseSchema
>

/**
 * Two-Step Verification Service
 *
 * Service for managing two-step verification (2FA) settings.
 * Two-step verification adds an extra layer of security to your WhatsApp Business Account.
 *
 * @example
 * ```typescript
 * // Set two-step verification PIN
 * await client.twoStepVerification.setPin('123456')
 *
 * // Remove two-step verification PIN
 * await client.twoStepVerification.removePin()
 * ```
 */
export class TwoStepVerificationService extends BaseService {
	/**
	 * Set a two-step verification PIN
	 * This PIN will be required when registering a phone number with WhatsApp Business API.
	 *
	 * @param pin - 6-digit PIN
	 * @returns Success response
	 *
	 * @example
	 * ```typescript
	 * await client.twoStepVerification.setPin('123456')
	 * ```
	 */
	async setPin(pin: string): Promise<TwoStepVerificationResponse> {
		const payload = TwoStepVerificationPinSchema.parse({ pin })

		const response = await this.request<TwoStepVerificationResponse>(
			`${this.config.phoneNumberId}`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return TwoStepVerificationResponseSchema.parse(response)
	}

	/**
	 * Remove the two-step verification PIN
	 * This will disable two-step verification for the phone number.
	 *
	 * @returns Success response
	 *
	 * @example
	 * ```typescript
	 * await client.twoStepVerification.removePin()
	 * ```
	 */
	async removePin(): Promise<TwoStepVerificationResponse> {
		const payload = { pin: '' }

		const response = await this.request<TwoStepVerificationResponse>(
			`${this.config.phoneNumberId}`,
			{
				method: 'POST',
				body: JSON.stringify(payload),
			},
		)

		return TwoStepVerificationResponseSchema.parse(response)
	}
}
