// Replace these presentation-only operations with an authentication provider when connected.
const pause = () => new Promise(resolve => setTimeout(resolve, 800));
export const authService = {
  async signUp() { await pause(); return { message: 'Your details look good. This preview does not create an account.' }; },
  async login() { await pause(); return { message: 'This is a preview. No login was performed.' }; },
  async resetPassword() { await pause(); return { message: 'Password reset is not connected yet, so no email was sent.' }; },
  async google() { await pause(); return { message: 'Google sign-in is not available yet. Please continue browsing instead.' }; }
};
