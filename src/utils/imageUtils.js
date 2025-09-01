// This is a utility function to create data URLs for placeholder images
// Used instead of external placeholder services that might be unreliable

/**
 * Creates a data URL for a placeholder image with custom text
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @param {string} text - Text to display on the placeholder
 * @param {string} bgColor - Background color in hex format (e.g., "#f0f0f0")
 * @param {string} textColor - Text color in hex format (e.g., "#333333")
 * @returns {string} - Data URL for the placeholder image
 */
export const createPlaceholderImage = (
  width = 300, 
  height = 140, 
  text = 'No Image', 
  bgColor = '#f0f0f0', 
  textColor = '#555555'
) => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Get the drawing context
  const ctx = canvas.getContext('2d');
  
  // Fill the background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add a subtle border
  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, width - 10, height - 10);
  
  // Add an icon (simple camera shape)
  ctx.fillStyle = textColor;
  const iconSize = Math.min(width, height) / 4;
  
  // Camera body
  ctx.fillRect(
    width / 2 - iconSize / 2,
    height / 2 - iconSize / 2 - iconSize / 3,
    iconSize,
    iconSize / 1.5
  );
  
  // Camera lens
  ctx.beginPath();
  ctx.arc(
    width / 2,
    height / 2,
    iconSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Add text
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.max(14, height / 10)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 + iconSize);
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
};

/**
 * Creates a reusable placeholder image element or URL
 * @param {Object} options - Configuration options
 * @param {number} options.width - Width of the placeholder image
 * @param {number} options.height - Height of the placeholder image
 * @param {string} options.text - Text to display on the placeholder
 * @param {string} options.returnType - Type of return value ('url' or 'element')
 * @returns {string|HTMLImageElement} - Data URL or Image element
 */
export const getPlaceholder = ({
  width = 300,
  height = 140,
  text = 'No Image',
  returnType = 'url'
} = {}) => {
  const placeholderUrl = createPlaceholderImage(width, height, text);
  
  if (returnType === 'element') {
    const img = new Image(width, height);
    img.src = placeholderUrl;
    img.alt = text;
    img.style.objectFit = 'cover';
    return img;
  }
  
  return placeholderUrl;
};

/**
 * Handler function for image loading errors
 * @param {Event} event - The error event
 * @param {Object} options - Placeholder options
 */
export const handleImageError = (event, { width = 300, height = 140, text = 'No Image' } = {}) => {
  const img = event.target;
  if (img) {
    img.src = createPlaceholderImage(
      parseInt(img.width) || width,
      parseInt(img.height) || height,
      text
    );
    img.onerror = null; // Prevent further error events
  }
};

export default {
  createPlaceholderImage,
  getPlaceholder,
  handleImageError
};
