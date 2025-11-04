import { z } from 'zod'

/**
 * Template button types
 */
export const TemplateButtonTypeSchema = z.enum([
	'CATALOG',
	'COPY_CODE',
	'EXTENSION',
	'FLOW',
	'MPM',
	'ORDER_DETAILS',
	'OTP',
	'PHONE_NUMBER',
	'POSTBACK',
	'REMINDER',
	'SEND_LOCATION',
	'SPM',
	'QUICK_REPLY',
	'URL',
	'VOICE_CALL',
])

export type TemplateButtonType = z.infer<typeof TemplateButtonTypeSchema>

/**
 * Template button object
 */
export const TemplateButtonSchema = z.object({
	/** The type of the button */
	message_template_button_type: TemplateButtonTypeSchema,
	/** The label text for the button */
	message_template_button_text: z.string(),
	/** The URL for URL-type buttons */
	message_template_button_url: z.string().optional(),
	/** The phone number for PHONE_NUMBER-type buttons */
	message_template_button_phone_number: z.string().optional(),
})

export type TemplateButton = z.infer<typeof TemplateButtonSchema>

/**
 * Template components update value object
 */
export const TemplateComponentsUpdateValueSchema = z.object({
	/** The unique identifier for the message template */
	message_template_id: z.number().int(),
	/** The name of the message template */
	message_template_name: z.string(),
	/** The language and locale code of the template (e.g., en_US) */
	message_template_language: z.string(),
	/** The body text of the template. Can include placeholders like {{1}} */
	message_template_element: z.string(),
	/** The header text of the template, only included if the template has a text header */
	message_template_title: z.string().optional(),
	/** The footer text of the template, only included if the template has a footer */
	message_template_footer: z.string().optional(),
	/** An array of button objects, only included if the template has buttons */
	message_template_buttons: z.array(TemplateButtonSchema).optional(),
})

export type TemplateComponentsUpdateValue = z.infer<
	typeof TemplateComponentsUpdateValueSchema
>

/**
 * Change object for template components update
 */
export const TemplateComponentsUpdateChangeSchema = z.object({
	value: TemplateComponentsUpdateValueSchema,
	field: z.literal('message_template_components_update'),
})

export type TemplateComponentsUpdateChange = z.infer<
	typeof TemplateComponentsUpdateChangeSchema
>

/**
 * Entry object for template components update
 */
export const TemplateComponentsUpdateEntrySchema = z.object({
	/** The WhatsApp Business Account ID */
	id: z.string(),
	/** Unix timestamp indicating when the webhook was triggered */
	time: z.number().int(),
	changes: z.array(TemplateComponentsUpdateChangeSchema),
})

export type TemplateComponentsUpdateEntry = z.infer<
	typeof TemplateComponentsUpdateEntrySchema
>

/**
 * Complete webhook payload for message_template_components_update
 */
export const MessageTemplateComponentsUpdateWebhookSchema = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(TemplateComponentsUpdateEntrySchema),
})

export type MessageTemplateComponentsUpdateWebhook = z.infer<
	typeof MessageTemplateComponentsUpdateWebhookSchema
>
