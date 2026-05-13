// Password strength validation: checks length, uppercase, numbers, special chars
export function validatePassword(password) {
  const errors = []
  if (password.length < 8) errors.push('Minimum 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
  if (!/[0-9]/.test(password)) errors.push('At least one number')
  if (!/[!@#$%^&*]/.test(password)) errors.push('At least one special character (!@#$%^&*)')
  return { valid: errors.length === 0, errors, strength: Math.min(100, (5 - errors.length) * 25) }
}

// Email validation
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Username validation
export function validateUsername(username) {
  const errors = []
  if (username.length < 3) errors.push('Minimum 3 characters')
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) errors.push('Only letters, numbers, underscore, hyphen')
  return { valid: errors.length === 0, errors }
}
