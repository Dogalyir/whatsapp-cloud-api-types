import { z } from 'zod'

/**
 * WhatsApp Business API data object
 */
export const WhatsAppBusinessAPIDataSchema = z.object({
	/** App ID */
	id: z.string(),
	/** App link */
	link: z.string(),
	/** App name */
	name: z.string(),
})

export type WhatsAppBusinessAPIData = z.infer<
	typeof WhatsAppBusinessAPIDataSchema
>

/**
 * Subscribed app object
 */
export const SubscribedAppSchema = z.object({
	whatsapp_business_api_data: WhatsAppBusinessAPIDataSchema,
})

export type SubscribedApp = z.infer<typeof SubscribedAppSchema>

/**
 * Subscribed app with override callback URI
 */
export const SubscribedAppWithOverrideSchema = z.object({
	whatsapp_business_api_data: WhatsAppBusinessAPIDataSchema,
	/** The alternate callback URL for this subscription */
	override_callback_uri: z.string(),
})

export type SubscribedAppWithOverride = z.infer<
	typeof SubscribedAppWithOverrideSchema
>

/**
 * Response when subscribing to WABA webhooks
 * @example
 * ```typescript
 * const response = await client.webhooks.subscribe(wabaId, ['messages'])
 * console.log(response)
 * // Output:
 * // {
 * //   success: true
 * // }
 * ```
 */
export const SubscribeToWABAResponseSchema = z.object({
	/** Whether the subscription was successful */
	success: z.boolean(),
})

export type SubscribeToWABAResponse = z.infer<
	typeof SubscribeToWABAResponseSchema
>

/**
 * Response when getting WABA subscriptions
 * @example
 * ```typescript
 * const subscriptions = await client.webhooks.getSubscriptions(wabaId)
 * console.log(subscriptions)
 * // Output:
 * // {
 * //   data: [{
 * //     whatsapp_business_api_data: {
 * //       id: '123456789',
 * //       link: 'https://...',
 * //       name: 'My App'
 * //     }
 * //   }]
 * // }
 * ```
 */
export const GetSubscriptionsResponseSchema = z.object({
	/** Array of subscribed apps */
	data: z.array(SubscribedAppSchema),
})

export type GetSubscriptionsResponse = z.infer<
	typeof GetSubscriptionsResponseSchema
>

/**
 * Response when unsubscribing from WABA webhooks
 * @example
 * ```typescript
 * const response = await client.webhooks.unsubscribe(wabaId)
 * console.log(response)
 * // Output:
 * // {
 * //   success: true
 * // }
 * ```
 */
export const UnsubscribeFromWABAResponseSchema = z.object({
	/** Whether the unsubscription was successful */
	success: z.boolean(),
})

export type UnsubscribeFromWABAResponse = z.infer<
	typeof UnsubscribeFromWABAResponseSchema
>

/**
 * Request to override callback URL for WABA webhooks
 * @example
 * ```typescript
 * const override = {
 *   override_callback_uri: 'https://my-server.com/webhook',
 *   verify_token: 'my-verify-token'
 * }
 * const response = await client.webhooks.subscribe(wabaId, ['messages'], override)
 * ```
 */
export const OverrideCallbackURLRequestSchema = z.object({
	/** The alternate webhook endpoint URL */
	override_callback_uri: z.string().url(),
	/** The verification token for the alternate webhook endpoint */
	verify_token: z.string(),
})

export type OverrideCallbackURLRequest = z.infer<
	typeof OverrideCallbackURLRequestSchema
>

/**
 * Response when overriding callback URL for WABA webhooks
 * @example
 * ```typescript
 * const subscriptions = await client.webhooks.getSubscriptions(wabaId)
 * console.log(subscriptions)
 * // Output:
 * // {
 * //   data: [{
 * //     whatsapp_business_api_data: {
 * //       id: '123456789',
 * //       link: 'https://...',
 * //       name: 'My App'
 * //     },
 * //     override_callback_uri: 'https://my-server.com/webhook'
 * //   }]
 * // }
 * ```
 */
export const OverrideCallbackURLResponseSchema = z.object({
	/** Array of subscribed apps with override callback URIs */
	data: z.array(SubscribedAppWithOverrideSchema),
})

export type OverrideCallbackURLResponse = z.infer<
	typeof OverrideCallbackURLResponseSchema
>
