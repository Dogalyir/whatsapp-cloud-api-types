import { z } from 'zod'

/**
 * Contact profile object
 */
export const ContactProfileSchema = z.object({
	/** Contact's profile name */
	name: z.string(),
})

export type ContactProfile = z.infer<typeof ContactProfileSchema>

/**
 * Contact object
 */
export const ContactSchema = z.object({
	profile: ContactProfileSchema,
	/** WhatsApp ID of the customer */
	wa_id: z.string(),
})

export type Contact = z.infer<typeof ContactSchema>

/**
 * Metadata object
 */
export const MetadataSchema = z.object({
	/** The phone number of the business account receiving the webhook */
	display_phone_number: z.string(),
	/** The ID of the phone number receiving the webhook */
	phone_number_id: z.string(),
})

export type Metadata = z.infer<typeof MetadataSchema>

/**
 * Text message object
 */
export const TextMessageSchema = z.object({
	/** The text body of the message */
	body: z.string(),
})

export type TextMessage = z.infer<typeof TextMessageSchema>

/**
 * Media object (for images, videos, audio, documents, stickers)
 */
export const MediaObjectSchema = z.object({
	/** Media ID */
	id: z.string(),
	/** MIME type of the media */
	mime_type: z.string().optional(),
	/** SHA256 hash of the media */
	sha256: z.string().optional(),
	/** Caption for the media (images, videos, documents) */
	caption: z.string().optional(),
	/** Filename for documents */
	filename: z.string().optional(),
	/** Whether this is a voice message (for audio) */
	voice: z.boolean().optional(),
	/** URL to download the media */
	url: z.string().optional(),
	/** Whether this is an animated sticker */
	animated: z.boolean().optional(),
})

export type MediaObject = z.infer<typeof MediaObjectSchema>

/**
 * Reaction object
 */
export const ReactionSchema = z.object({
	/** The wamid of the message that was reacted to */
	message_id: z.string(),
	/** The emoji used for the reaction */
	emoji: z.string(),
})

export type Reaction = z.infer<typeof ReactionSchema>

/**
 * Location object
 */
export const LocationSchema = z.object({
	/** Latitude of the location */
	latitude: z.union([z.string(), z.number()]),
	/** Longitude of the location */
	longitude: z.union([z.string(), z.number()]),
	/** Name of the location */
	name: z.string().optional(),
	/** Address of the location */
	address: z.string().optional(),
	/** URL of the location */
	url: z.string().optional(),
})

export type Location = z.infer<typeof LocationSchema>

/**
 * Context object (for forwarded messages or replies)
 */
export const ContextSchema = z.object({
	/** Set to true if the message was forwarded */
	forwarded: z.boolean().optional(),
	/** Set to true if the message was frequently forwarded */
	frequently_forwarded: z.boolean().optional(),
	/** Sender's WhatsApp ID (for replies) */
	from: z.string().optional(),
	/** Message ID of the original message being replied to */
	id: z.string().optional(),
	/** Product information (for catalog messages) */
	referred_product: z
		.object({
			catalog_id: z.string(),
			product_retailer_id: z.string(),
		})
		.optional(),
})

export type Context = z.infer<typeof ContextSchema>

/**
 * Button reply object
 */
export const ButtonReplySchema = z.object({
	/** ID of the button */
	id: z.string(),
	/** Title text of the button */
	title: z.string(),
})

export type ButtonReply = z.infer<typeof ButtonReplySchema>

/**
 * List reply object
 */
export const ListReplySchema = z.object({
	/** ID of the list item */
	id: z.string(),
	/** Title of the list item */
	title: z.string(),
	/** Description of the list item */
	description: z.string().optional(),
})

export type ListReply = z.infer<typeof ListReplySchema>

/**
 * Interactive object
 */
export const InteractiveSchema = z.object({
	/** Type of interactive object */
	type: z.enum(['button_reply', 'list_reply']),
	/** Button reply object (if type is button_reply) */
	button_reply: ButtonReplySchema.optional(),
	/** List reply object (if type is list_reply) */
	list_reply: ListReplySchema.optional(),
})

export type Interactive = z.infer<typeof InteractiveSchema>

/**
 * Error object
 */
export const ErrorObjectSchema = z.object({
	/** Error code */
	code: z.number().int(),
	/** Error title */
	title: z.string().optional(),
	/** Error message */
	message: z.string().optional(),
	/** Error data object */
	error_data: z
		.object({
			/** Error details */
			details: z.string(),
		})
		.optional(),
	/** Link to error documentation */
	href: z.string().optional(),
})

export type ErrorObject = z.infer<typeof ErrorObjectSchema>

/**
 * Contact name object
 */
export const ContactNameSchema = z.object({
	/** Full formatted name */
	formatted_name: z.string(),
	/** First name */
	first_name: z.string().optional(),
	/** Last name */
	last_name: z.string().optional(),
	/** Middle name */
	middle_name: z.string().optional(),
	/** Name suffix */
	suffix: z.string().optional(),
	/** Name prefix */
	prefix: z.string().optional(),
})

export type ContactName = z.infer<typeof ContactNameSchema>

/**
 * Contact phone object
 */
export const ContactPhoneSchema = z.object({
	/** Phone number */
	phone: z.string().optional(),
	/** Type of phone (CELL, MAIN, IPHONE, HOME, WORK) */
	type: z.string().optional(),
	/** WhatsApp ID */
	wa_id: z.string().optional(),
})

export type ContactPhone = z.infer<typeof ContactPhoneSchema>

/**
 * Contact organization object
 */
export const ContactOrgSchema = z.object({
	/** Company name */
	company: z.string().optional(),
	/** Department name */
	department: z.string().optional(),
	/** Contact's title */
	title: z.string().optional(),
})

export type ContactOrg = z.infer<typeof ContactOrgSchema>

/**
 * Contact address object
 */
export const ContactAddressSchema = z.object({
	/** Street address */
	street: z.string().optional(),
	/** City */
	city: z.string().optional(),
	/** State */
	state: z.string().optional(),
	/** ZIP code */
	zip: z.string().optional(),
	/** Country */
	country: z.string().optional(),
	/** Country code */
	country_code: z.string().optional(),
	/** Address type (HOME, WORK) */
	type: z.string().optional(),
})

export type ContactAddress = z.infer<typeof ContactAddressSchema>

/**
 * Contact email object
 */
export const ContactEmailSchema = z.object({
	/** Email address */
	email: z.string().optional(),
	/** Email type (HOME, WORK) */
	type: z.string().optional(),
})

export type ContactEmail = z.infer<typeof ContactEmailSchema>

/**
 * Contact URL object
 */
export const ContactUrlSchema = z.object({
	/** URL */
	url: z.string().optional(),
	/** URL type (HOME, WORK) */
	type: z.string().optional(),
})

export type ContactUrl = z.infer<typeof ContactUrlSchema>

/**
 * Contact item in contacts message
 */
export const ContactItemSchema = z.object({
	/** Contact name */
	name: ContactNameSchema,
	/** Organization */
	org: ContactOrgSchema.optional(),
	/** Phone numbers */
	phones: z.array(ContactPhoneSchema).optional(),
	/** Email addresses */
	emails: z.array(ContactEmailSchema).optional(),
	/** URLs */
	urls: z.array(ContactUrlSchema).optional(),
	/** Addresses */
	addresses: z.array(ContactAddressSchema).optional(),
	/** Birthday (YYYY-MM-DD) */
	birthday: z.string().optional(),
})

export type ContactItem = z.infer<typeof ContactItemSchema>

/**
 * Product item in order
 */
export const ProductItemSchema = z.object({
	/** Product retailer ID */
	product_retailer_id: z.string(),
	/** Quantity */
	quantity: z.union([z.string(), z.number()]),
	/** Item price */
	item_price: z.union([z.string(), z.number()]),
	/** Currency code */
	currency: z.string(),
})

export type ProductItem = z.infer<typeof ProductItemSchema>

/**
 * Order object
 */
export const OrderSchema = z.object({
	/** Catalog ID */
	catalog_id: z.string(),
	/** Product items in the order */
	product_items: z.array(ProductItemSchema),
	/** Optional text message */
	text: z.string().optional(),
})

export type Order = z.infer<typeof OrderSchema>

/**
 * System message object
 */
export const SystemMessageSchema = z.object({
	/** System message body */
	body: z.string().optional(),
	/** Type of system message (customer_changed_number, customer_identity_changed, etc.) */
	type: z.string().optional(),
	/** WhatsApp ID */
	wa_id: z.string().optional(),
	/** Customer phone number */
	customer: z.string().optional(),
	/** Identity hash */
	identity: z.string().optional(),
	/** User description */
	user: z.string().optional(),
	/** New WhatsApp ID (for customer_changed_number) */
	new_wa_id: z.string().optional(),
})

export type SystemMessage = z.infer<typeof SystemMessageSchema>

/**
 * Referral object
 */
export const ReferralSchema = z.object({
	/** Source URL */
	source_url: z.string().optional(),
	/** Source ID */
	source_id: z.string().optional(),
	/** Source type (ad, post, etc.) */
	source_type: z.string().optional(),
	/** Headline of the ad */
	headline: z.string().optional(),
	/** Body of the ad */
	body: z.string().optional(),
	/** Media type (image, video) */
	media_type: z.string().optional(),
	/** Image URL */
	image_url: z.string().optional(),
	/** Video URL */
	video_url: z.string().optional(),
	/** Thumbnail URL */
	thumbnail_url: z.string().optional(),
	/** Click to WhatsApp Ad ID */
	ctwa_clid: z.string().optional(),
	/** Welcome message */
	welcome_message: z
		.object({
			text: z.string(),
		})
		.optional(),
})

export type Referral = z.infer<typeof ReferralSchema>

/**
 * Message object
 */
export const MessageSchema = z.object({
	/** Sender's phone number */
	from: z.string(),
	/** Unique identifier of the message */
	id: z.string(),
	/** Unix timestamp of when the message was sent */
	timestamp: z.string(),
	/** Type of message */
	type: z.string(),
	/** Group ID (for group messages) */
	group_id: z.string().optional(),
	/** Context (for replies or forwarded messages) */
	context: ContextSchema.optional(),
	/** Referral information (for messages from ads) */
	referral: ReferralSchema.optional(),
	/** Text message content */
	text: TextMessageSchema.optional(),
	/** Image message content */
	image: MediaObjectSchema.optional(),
	/** Video message content */
	video: MediaObjectSchema.optional(),
	/** Audio message content */
	audio: MediaObjectSchema.optional(),
	/** Document message content */
	document: MediaObjectSchema.optional(),
	/** Sticker message content */
	sticker: MediaObjectSchema.optional(),
	/** Location message content */
	location: LocationSchema.optional(),
	/** Contacts message content */
	contacts: z.array(ContactItemSchema).optional(),
	/** Interactive message content */
	interactive: InteractiveSchema.optional(),
	/** Button message content */
	button: z
		.object({ text: z.string(), payload: z.string().optional() })
		.optional(),
	/** Reaction message content */
	reaction: ReactionSchema.optional(),
	/** Order message content */
	order: OrderSchema.optional(),
	/** System message content */
	system: SystemMessageSchema.optional(),
	/** Errors related to the message */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type Message = z.infer<typeof MessageSchema>

/**
 * Conversation object
 */
export const ConversationSchema = z.object({
	/** Conversation ID */
	id: z.string(),
	/** Origin of the conversation */
	origin: z
		.object({
			/** Type of conversation (business_initiated, customer_initiated, referral_conversion, etc.) */
			type: z.string(),
		})
		.optional(),
	/** Unix timestamp of when the conversation expires */
	expiration_timestamp: z.string().optional(),
})

export type Conversation = z.infer<typeof ConversationSchema>

/**
 * Pricing object
 */
export const PricingSchema = z.object({
	/** Pricing model (CBP, NBP, etc.) */
	pricing_model: z.string(),
	/** Whether the conversation is billable */
	billable: z.boolean(),
	/** Conversation category for pricing */
	category: z.string(),
})

export type Pricing = z.infer<typeof PricingSchema>

/**
 * Status object
 */
export const StatusSchema = z.object({
	/** Message ID */
	id: z.string(),
	/** WhatsApp ID of the recipient */
	recipient_id: z.string(),
	/** Status of the message */
	status: z.enum(['read', 'delivered', 'sent', 'failed', 'deleted']),
	/** Unix timestamp of the status update */
	timestamp: z.string(),
	/** Conversation information (for first message in conversation) */
	conversation: ConversationSchema.optional(),
	/** Pricing information */
	pricing: PricingSchema.optional(),
	/** Errors (if status is failed) */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type Status = z.infer<typeof StatusSchema>

/**
 * Value object for messages webhook
 */
export const MessagesValueSchema = z.object({
	/** Messaging product (always "whatsapp") */
	messaging_product: z.literal('whatsapp'),
	/** Metadata about the phone number */
	metadata: MetadataSchema,
	/** Array of contacts (senders) */
	contacts: z.array(ContactSchema).optional(),
	/** Array of messages received */
	messages: z.array(MessageSchema).optional(),
	/** Array of message status updates */
	statuses: z.array(StatusSchema).optional(),
	/** Array of errors */
	errors: z.array(ErrorObjectSchema).optional(),
})

export type MessagesValue = z.infer<typeof MessagesValueSchema>

/**
 * Change object for messages webhook
 */
export const MessagesChangeSchema = z.object({
	value: MessagesValueSchema,
	field: z.literal('messages'),
})

export type MessagesChange = z.infer<typeof MessagesChangeSchema>

/**
 * Entry object for messages webhook
 */
export const MessagesEntrySchema = z.object({
	/** WhatsApp Business Account ID */
	id: z.string(),
	/** Array of changes */
	changes: z.array(MessagesChangeSchema),
})

export type MessagesEntry = z.infer<typeof MessagesEntrySchema>

/**
 * Complete webhook payload for messages
 */
export const MessagesWebhookSchema = z.object({
	object: z.literal('whatsapp_business_account'),
	entry: z.array(MessagesEntrySchema),
})

export type MessagesWebhook = z.infer<typeof MessagesWebhookSchema>
