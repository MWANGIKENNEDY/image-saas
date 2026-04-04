/**
 * ImageKit integration module for image storage and CDN delivery.
 * Provides utilities for uploading images to ImageKit with automatic optimization.
 * 
 * ImageKit is a real-time image optimization and CDN service that:
 * - Stores images in the cloud
 * - Automatically optimizes images for web delivery
 * - Provides fast CDN URLs for global access
 * - Supports transformations (resize, crop, format conversion)
 */

import ImageKit, { toFile } from "@imagekit/nodejs";

/**
 * Private singleton instance of the ImageKit client.
 * Initialized lazily on first use to avoid unnecessary connections.
 * 
 * @private
 */
let _client: InstanceType<typeof ImageKit> | null = null;

/**
 * Returns the singleton ImageKit client instance.
 * Uses the Singleton pattern to ensure only one client exists throughout the app lifecycle.
 * 
 * Benefits of singleton pattern:
 * - Prevents multiple API connections
 * - Reduces memory overhead
 * - Ensures consistent configuration
 * - Avoids rate limiting issues
 * 
 * @returns ImageKit client instance configured with private key from environment
 * @throws Error if IMAGEKIT_PRIVATE_KEY environment variable is not set
 */
function getClient() {
  if (!_client) {
    _client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    });
  }
  return _client;
}

/**
 * Uploads a Buffer (raw image data) to ImageKit storage.
 * Converts the buffer to a file format, uploads it, and returns the CDN URL.
 * 
 * The uploaded image will:
 * - Be stored in the specified folder
 * - Have a unique filename (prevents overwrites)
 * - Be accessible via a CDN URL for fast global delivery
 * - Support ImageKit transformations (resize, crop, etc.)
 * 
 * @param params - Upload configuration
 * @param params.buffer - Raw image data as a Node.js Buffer
 * @param params.fileName - Original filename (will be made unique by ImageKit)
 * @param params.folder - ImageKit folder path (e.g., "/generations", "/uploads")
 * @param params.mimeType - Image MIME type (e.g., "image/png", "image/jpeg")
 * 
 * @returns Promise resolving to upload result with CDN URL and file ID
 * @returns url - Public CDN URL to access the uploaded image
 * @returns fileId - Unique ImageKit file identifier for management operations
 * 
 * @example
 * const result = await uploadBufferToImageKit({
 *   buffer: imageBuffer,
 *   fileName: "user-avatar.png",
 *   folder: "/avatars",
 *   mimeType: "image/png"
 * });
 * console.log(result.url); // https://ik.imagekit.io/your-id/avatars/user-avatar_abc123.png
 * 
 * @throws Error if upload fails or ImageKit credentials are invalid
 */
export async function uploadBufferToImageKit(params: {
  buffer: Buffer;
  fileName: string;
  folder: string;
  mimeType: string;
}) {
  // Get the singleton ImageKit client instance
  const client = getClient();
  
  // Convert Buffer to File object that ImageKit expects
  const file = await toFile(params.buffer, params.fileName, { type: params.mimeType });

  // Upload to ImageKit with unique filename generation enabled
  const result = await client.files.upload({
    file,
    fileName: params.fileName,
    folder: params.folder,
    useUniqueFileName: true, // Prevents filename conflicts by appending unique suffix
  });

  // Return the public CDN URL and file ID for database storage
  return { url: result.url!, fileId: result.fileId! };
}