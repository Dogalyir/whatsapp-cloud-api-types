/**
 * WhatsApp Cloud API Client - Usage Examples
 *
 * This file demonstrates how to use the WhatsApp Cloud API client
 * to send messages, manage media, and interact with business profiles.
 */

import { WhatsAppCloudAPI } from '../src/client'

// Initialize the client
const client = new WhatsAppCloudAPI({
	accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
	phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
	wabaId: process.env.WHATSAPP_WABA_ID, // Optional
	version: 'v21.0', // Optional, defaults to v21.0
})

// Example phone number (in E.164 format, without +)
const recipientPhone = '1234567890'

/**
 * TEXT MESSAGES
 */
async function sendTextExamples() {
	// Simple text message
	await client.messages.sendText(recipientPhone, 'Hello, World!')

	// Text message with URL preview
	await client.messages.sendText(
		recipientPhone,
		'Check this out: https://example.com',
		true, // Enable URL preview
	)
}

/**
 * MEDIA MESSAGES
 */
async function sendMediaExamples() {
	// Send image by URL
	await client.messages.sendImage(
		recipientPhone,
		{ link: 'https://example.com/image.jpg' },
		'Check this image!', // Optional caption
	)

	// Send image by media ID (after uploading)
	const uploadResult = await client.media.upload(
		new File([new Blob()], 'image.jpg'),
		'image/jpeg',
	)
	await client.messages.sendImage(
		recipientPhone,
		{ id: uploadResult.id },
		'Uploaded image',
	)

	// Send video
	await client.messages.sendVideo(
		recipientPhone,
		{ link: 'https://example.com/video.mp4' },
		'Cool video!',
	)

	// Send audio
	await client.messages.sendAudio(recipientPhone, {
		link: 'https://example.com/audio.mp3',
	})

	// Send document
	await client.messages.sendDocument(
		recipientPhone,
		{ link: 'https://example.com/document.pdf' },
		'Here is the document', // Optional caption
		'document.pdf', // Optional filename
	)

	// Send sticker
	await client.messages.sendSticker(recipientPhone, {
		link: 'https://example.com/sticker.webp',
	})
}

/**
 * LOCATION MESSAGES
 */
async function sendLocationExample() {
	await client.messages.sendLocation(recipientPhone, {
		latitude: 37.7749,
		longitude: -122.4194,
		name: 'San Francisco',
		address: 'San Francisco, CA, USA',
	})
}

/**
 * CONTACT MESSAGES
 */
async function sendContactExample() {
	await client.messages.sendContacts(recipientPhone, [
		{
			name: {
				formatted_name: 'John Doe',
				first_name: 'John',
				last_name: 'Doe',
			},
			phones: [
				{
					phone: '+1234567890',
					type: 'CELL',
				},
			],
			emails: [
				{
					email: 'john@example.com',
					type: 'WORK',
				},
			],
			org: {
				company: 'Example Corp',
				title: 'CEO',
			},
		},
	])
}

/**
 * TEMPLATE MESSAGES
 */
async function sendTemplateExample() {
	// Simple template without parameters
	await client.messages.sendTemplate(recipientPhone, {
		name: 'hello_world',
		language: {
			code: 'en_US',
		},
	})

	// Template with parameters
	await client.messages.sendTemplate(recipientPhone, {
		name: 'order_confirmation',
		language: {
			code: 'en',
		},
		components: [
			{
				type: 'header',
				parameters: [
					{
						type: 'image',
						image: {
							link: 'https://example.com/product.jpg',
						},
					},
				],
			},
			{
				type: 'body',
				parameters: [
					{
						type: 'text',
						text: 'John',
					},
					{
						type: 'text',
						text: '#12345',
					},
					{
						type: 'currency',
						currency: {
							fallback_value: '$99.99',
							code: 'USD',
							amount_1000: 99990,
						},
					},
				],
			},
		],
	})
}

/**
 * INTERACTIVE MESSAGES - BUTTONS
 */
async function sendInteractiveButtonsExample() {
	await client.messages.sendInteractiveButtons(recipientPhone, {
		type: 'button',
		body: {
			text: 'Would you like to continue?',
		},
		action: {
			buttons: [
				{
					type: 'reply',
					reply: {
						id: 'btn_yes',
						title: 'Yes',
					},
				},
				{
					type: 'reply',
					reply: {
						id: 'btn_no',
						title: 'No',
					},
				},
			],
		},
	})

	// With header and footer
	await client.messages.sendInteractiveButtons(recipientPhone, {
		type: 'button',
		header: {
			type: 'text',
			text: 'Confirmation Required',
		},
		body: {
			text: 'Please confirm your selection',
		},
		footer: {
			text: 'Powered by WhatsApp',
		},
		action: {
			buttons: [
				{
					type: 'reply',
					reply: {
						id: 'confirm',
						title: 'Confirm',
					},
				},
				{
					type: 'reply',
					reply: {
						id: 'cancel',
						title: 'Cancel',
					},
				},
			],
		},
	})
}

/**
 * INTERACTIVE MESSAGES - LISTS
 */
async function sendInteractiveListExample() {
	await client.messages.sendInteractiveList(recipientPhone, {
		type: 'list',
		header: {
			type: 'text',
			text: 'Our Products',
		},
		body: {
			text: 'Select a product category',
		},
		footer: {
			text: 'Best prices guaranteed',
		},
		action: {
			button: 'View Categories',
			sections: [
				{
					title: 'Electronics',
					rows: [
						{
							id: 'laptop',
							title: 'Laptops',
							description: 'High-performance laptops',
						},
						{
							id: 'phone',
							title: 'Smartphones',
							description: 'Latest smartphones',
						},
					],
				},
				{
					title: 'Clothing',
					rows: [
						{
							id: 'shirts',
							title: 'Shirts',
							description: 'Casual and formal shirts',
						},
						{
							id: 'pants',
							title: 'Pants',
							description: 'Jeans and trousers',
						},
					],
				},
			],
		},
	})
}

/**
 * REACTIONS
 */
async function sendReactionExamples() {
	const messageId = 'wamid.xxxxx' // Message ID you want to react to

	// Add reaction
	await client.messages.sendReaction(recipientPhone, messageId, '👍')

	// Remove reaction
	await client.messages.removeReaction(recipientPhone, messageId)
}

/**
 * MARK AS READ
 */
async function markAsReadExample() {
	const messageId = 'wamid.xxxxx' // Message ID to mark as read
	await client.messages.markAsRead(messageId)
}

/**
 * MEDIA MANAGEMENT
 */
async function mediaManagementExamples() {
	// Upload media from file
	const file = new File([new Blob()], 'image.jpg')
	const uploadResult = await client.media.upload(
		file,
		'image/jpeg',
		'image.jpg',
	)
	console.log('Media ID:', uploadResult.id)

	// Upload media from URL
	const uploadFromUrlResult = await client.media.uploadFromUrl(
		'https://example.com/image.jpg',
		'image/jpeg',
		'downloaded-image.jpg',
	)
	console.log('Media ID:', uploadFromUrlResult.id)

	// Get media URL
	const mediaUrl = await client.media.getUrl(uploadResult.id)
	console.log('Media URL:', mediaUrl.url)
	console.log('MIME Type:', mediaUrl.mime_type)
	console.log('File Size:', mediaUrl.file_size)

	// Download media
	const content = await client.media.download(mediaUrl.url)
	console.log('Downloaded:', content.byteLength, 'bytes')

	// Get media directly (combines getUrl and download)
	const media = await client.media.get(uploadResult.id)
	console.log('Media:', media.mime_type, media.content.byteLength, 'bytes')

	// Delete media
	await client.media.delete(uploadResult.id)
}

/**
 * BUSINESS PROFILE MANAGEMENT
 */
async function businessProfileExamples() {
	// Get business profile
	const profile = await client.business.getProfile()
	console.log('Business Profile:', profile.data[0])

	// Update business profile
	await client.business.updateProfile({
		about: 'We are a tech company',
		description: 'Building amazing products',
		email: 'contact@example.com',
		websites: ['https://example.com'],
		vertical: 'PROF_SERVICES',
	})

	// Get phone number info
	const phoneInfo = await client.business.getPhoneNumberInfo()
	console.log('Phone Number:', phoneInfo.display_phone_number)
	console.log('Quality Rating:', phoneInfo.quality_rating)

	// Get commerce settings (requires wabaId)
	const commerceSettings = await client.business.getCommerceSettings()
	console.log('Commerce Settings:', commerceSettings)

	// Update commerce settings
	await client.business.updateCommerceSettings({
		is_catalog_visible: true,
		is_cart_enabled: true,
	})
}

/**
 * ERROR HANDLING
 */
async function errorHandlingExample() {
	try {
		await client.messages.sendText(recipientPhone, 'Hello!')
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error:', error.message)
		}
	}
}

/**
 * COMPLETE CONVERSATION FLOW
 */
async function conversationFlowExample() {
	// 1. Send a welcome message with buttons
	await client.messages.sendInteractiveButtons(recipientPhone, {
		type: 'button',
		body: {
			text: 'Welcome! How can I help you today?',
		},
		action: {
			buttons: [
				{
					type: 'reply',
					reply: { id: 'support', title: 'Support' },
				},
				{
					type: 'reply',
					reply: { id: 'sales', title: 'Sales' },
				},
				{
					type: 'reply',
					reply: { id: 'info', title: 'Info' },
				},
			],
		},
	})

	// 2. Based on user response, send a product list
	await client.messages.sendInteractiveList(recipientPhone, {
		type: 'list',
		body: {
			text: 'Here are our products:',
		},
		action: {
			button: 'View Products',
			sections: [
				{
					rows: [
						{
							id: 'product_1',
							title: 'Product 1',
							description: 'Description 1',
						},
						{
							id: 'product_2',
							title: 'Product 2',
							description: 'Description 2',
						},
					],
				},
			],
		},
	})

	// 3. Send product details with image
	const mediaId = await client.media.uploadFromUrl(
		'https://example.com/product.jpg',
		'image/jpeg',
	)
	await client.messages.sendImage(
		recipientPhone,
		{ id: mediaId.id },
		'Product details and pricing',
	)

	// 4. Send order confirmation template
	await client.messages.sendTemplate(recipientPhone, {
		name: 'order_confirmation',
		language: { code: 'en' },
	})

	// 5. Send location of store
	await client.messages.sendLocation(recipientPhone, {
		latitude: 37.7749,
		longitude: -122.4194,
		name: 'Our Store',
		address: '123 Main St, San Francisco, CA',
	})
}

// Export all examples
export {
	sendTextExamples,
	sendMediaExamples,
	sendLocationExample,
	sendContactExample,
	sendTemplateExample,
	sendInteractiveButtonsExample,
	sendInteractiveListExample,
	sendReactionExamples,
	markAsReadExample,
	mediaManagementExamples,
	businessProfileExamples,
	errorHandlingExample,
	conversationFlowExample,
}
