/**
 * Help to format errors from the wallet provider
 * @param error
 * @returns string
 */
export const getErrorMessage = (error: any): string => {
  // Log the initial message to help users to debug
  console.error(error);

  // Attempt to extract a readable message from the error
  const message = error.message ? error.message : error;

  try {
    // Contract error
    const match = message.match(/"?message"?:"(.*?)"/m);
    return match && match.length >= 2 ? match[1] : message;
  } catch (err: any) {
    // API error
    if (message.errors) {
      return message.errors.map((errorItem: { message: string }) => errorItem.message);
    }
    try {
      // First fallback - stringify message
      return JSON.stringify(message);
    } catch {
      // Second fallback if stringifying does not succeed - return message
      return message;
    }
  }
};

/**
 * Helper to format errors from the API
 * @param error
 * @returns string[]
 */
export const getApiErrorMessage = (error: any) => {
  return error.errors ? error.errors.map((errorItem: { message: string }) => errorItem.message) : JSON.stringify(error);
};
