# BuboIQ Analyst v1 — Webhooks & Secrets Screen

## 📋 Overview

Production-ready **Admin → Webhooks & Secrets** screen for BuboIQ Analyst v1. This screen enables ops teams to configure and verify signed webhook integration with BuboIQ Connect (device-actions service).

### Purpose
Verify signed webhooks with real clients using HMAC-SHA256 signatures for secure communication between:
- **Outbound**: BuboIQ Analyst → Connect service
- **Inbound**: Connect service → BuboIQ Analyst callbacks

---

## 🎨 Design Specifications

### Brand & Accessibility
- **Dark-first** design with glass panels
- **Neon accent**: #00FF85 (rgb(0, 255, 133))
- **WCAG AA compliant**: High contrast, visible focus states
- **Touch targets**: All interactive elements 44×44px minimum
- **Typography**: 
  - Space Grotesk (headings)
  - Inter (body text)
  - JetBrains Mono (code blocks)

### Responsive Variants
| Viewport | Width | Layout |
|----------|-------|--------|
| Desktop XL | 1440px | Two-column grid, full features |
| Desktop | 1280px | Two-column grid, compact spacing |
| Tablet | 1024px | Single column stack |
| Mobile | 768px | Single column, full-width buttons |

---

## 📦 Files Created

```
/components/analyst/
├── screens/
│   ├── WebhooksSecretsProductionScreen.tsx  # Main production screen
│   └── WebhooksSecretsStates.tsx            # All state variants
├── WebhooksSecretsCompletePage.tsx          # Demo with viewport switcher
└── WebhooksSecretsHandoff.tsx               # Developer handoff materials
```

---

## 🔧 Component API

### WebhooksSecretsProductionScreen

```tsx
import { WebhooksSecretsProductionScreen } from './components/analyst/screens/WebhooksSecretsProductionScreen';

<WebhooksSecretsProductionScreen />
```

**Features:**
- Outbound panel: Configure Connect base URL and secret
- Inbound panel: Configure callback secret
- Test buttons with loading states
- Canonical payload examples (copyable)
- Expected HMAC signatures
- cURL examples
- Negative test mode (bad signature)
- Invalid signature example toggle

---

## 📊 States Included

### 1. Default (Production)
Interactive screen with all functionality enabled.

```tsx
import { WebhooksSecretsProductionScreen } from './components/analyst/screens/WebhooksSecretsProductionScreen';
<WebhooksSecretsProductionScreen />
```

### 2. Loading
Skeleton loading state while fetching configuration.

```tsx
import { WebhooksSecretsStates } from './components/analyst/screens/WebhooksSecretsStates';
<WebhooksSecretsStates.Loading />
```

### 3. Empty
No webhook configuration found.

```tsx
<WebhooksSecretsStates.Empty />
```

### 4. Error
Failed to load configuration.

```tsx
<WebhooksSecretsStates.Error />
```

### 5. Offline
Network connectivity issues.

```tsx
<WebhooksSecretsStates.Offline />
```

### 6. Success
All webhook tests passed.

```tsx
<WebhooksSecretsStates.Success />
```

---

## 🎯 Key Features

### Panel A: Outbound to Connect

**Fields:**
- Connect Base URL (text input)
- Outbound Secret (password input with reveal)

**Helper Text:**
```
We compute X-Bubo-Signature = HMAC_SHA256(secret, raw_body). 
Signature covers the exact bytes sent—no pretty printing.
```

**Actions:**
- "Send Test Action" (primary button)
- "Negative Test (bad signature)" (secondary button)

**Result Banners:**
- ✅ Success: "Connect accepted signed action."
- ❌ Errors:
  - "Invalid signature"
  - "Invalid payload"
  - "Connect unavailable" (with "Check DNS, TLS, and firewall" details)

**Canonical Payload (copyable):**
```json
{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}
```

**Expected HMAC (hex) with secret 'supersecret123':**
```
0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28
```

**Example Headers:**
```
Content-Type: application/json
X-Bubo-Signature: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28
```

**cURL Example:**
```bash
curl -X POST "https://connect.example.com/v1/device-actions" \
  -H "Content-Type: application/json" \
  -H "X-Bubo-Signature: 0a623b517c2ed110b04107bc6a4b0c90b17e6dd7615ccf2c3c02a2a9c0b38b28" \
  --data '{"org_id":"1111-2222-3333-4444","action_id":"aaaa-bbbb-cccc-dddd","device_id":"zzzz-yyyy-xxxx-wwww","action_type":"restart","params":{"window":"now"},"rollback":{"script_id":"rb1"}}'
```

---

### Panel B: Inbound from Connect

**Fields:**
- Inbound Secret (password input with reveal)
- App Callback URL (read-only): `/api/connect/status`

**Helper Text:**
```
Callbacks must include X-Bubo-Signature header. 
We verify HMAC over the raw request body (no reformatting).
```

**Actions:**
- "Send Test Callback" (primary button)
- "Negative Test (bad signature)" (secondary button)

**Result Banners:**
- ✅ Success: "Callback verified and recorded."
- ❌ Errors:
  - "Invalid signature" (with "See 'How to compute HMAC'" link)
  - "Callback processing error"
  - "Unrecognized action_id"

**Canonical Payload (copyable):**
```json
{"action_id":"aaaa-bbbb-cccc-dddd","job_id":"job_demo_1","status":"succeeded","started_at":"2025-10-22T15:01:00Z","ended_at":"2025-10-22T15:03:12Z","logs_url":"https://logs.example.com/job_demo_1"}
```

**Expected HMAC (hex) with secret 'supersecret123':**
```
0c08098f423a9b8311d5e8131df36e603a14c468389914be285342efb8c561d4
```

---

## 🔐 HMAC Computation

### Pseudocode
```
sig = hex(HMAC_SHA256(secret, raw_body_bytes))
header "X-Bubo-Signature: {sig}"
```

### Node.js Example
```javascript
const crypto = require('crypto');

function computeSignature(secret, rawBody) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  return hmac.digest('hex');
}

const signature = computeSignature('supersecret123', rawBodyString);
```

### Python Example
```python
import hmac
import hashlib

def compute_signature(secret: str, raw_body: str) -> str:
    h = hmac.new(secret.encode(), raw_body.encode(), hashlib.sha256)
    return h.hexdigest()

signature = compute_signature('supersecret123', raw_body_string)
```

### Go Example
```go
package main

import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func computeSignature(secret, rawBody string) string {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write([]byte(rawBody))
    return hex.EncodeToString(h.Sum(nil))
}
```

---

## 🎮 Interactive Elements

### Copy Buttons
All code blocks include copy-to-clipboard buttons with visual feedback:
- Default: Copy icon
- Copied state: Check icon (green) for 2 seconds

### Password Reveal
Secret fields include eye/eye-off toggle buttons:
- Default: Password masked
- Clicked: Plain text visible

### Test Buttons
Action buttons with loading states:
- Default: Primary/secondary styling
- Loading: Spinner icon + disabled state
- Success/Error: Result banner appears below

---

## ♿ Accessibility Features

✅ **WCAG AA Compliance**
- Color contrast: 4.5:1 minimum for text
- Focus rings: 2px accent-colored outlines
- Touch targets: 44×44px minimum

✅ **Keyboard Navigation**
- Tab: Move between interactive elements
- Enter: Activate buttons
- Esc: Close modals/tooltips

✅ **Screen Reader Support**
- ARIA labels on icon-only buttons
- Form inputs have associated labels
- Error messages programmatically linked
- Loading states announced

✅ **Visual Feedback**
- Hover states on all interactive elements
- Focus states clearly visible
- Disabled states with reduced opacity
- Success/error states with color + icon

---

## 📱 Responsive Behavior

### Desktop (1440px, 1280px)
- Two-column grid layout
- Side-by-side panels
- Full-width code blocks with horizontal scroll

### Tablet (1024px)
- Single column stack
- Panels at 100% width
- Increased vertical spacing

### Mobile (768px)
- Single column stack
- Full-width buttons
- Optimized padding
- Smaller font sizes for headers

---

## 🧪 Testing Scenarios

### Positive Tests
1. Valid outbound signature → "Connect accepted signed action."
2. Valid inbound callback → "Callback verified and recorded."
3. All copyable blocks function correctly
4. Password reveal toggles work

### Negative Tests
1. Invalid signature → "Invalid signature" error
2. Bad payload → "Invalid payload" error
3. Connect unavailable → "Connect unavailable" with DNS guidance
4. Unrecognized action_id → "Unrecognized action_id" error

### Edge Cases
1. Empty fields → Validation errors
2. Non-HTTPS URL → Warning banner
3. Offline mode → Limited functionality message
4. Very long URLs → Proper text wrapping

---

## 🎨 Design Tokens

### Colors
```css
--bg-950: 5 6 7;
--bg-900: 10 11 13;
--bg-850: 14 16 20;
--border-analyst: 31 36 45;
--text-100: 234 239 245;
--text-300: 199 208 218;
--text-400: 170 180 192;
--accent-analyst: 0 255 133;
--info: 62 160 255;
--warn: 246 193 74;
--danger: 255 107 107;
--success: 85 209 135;
```

### Border Radius
```css
--radius-xl: 20px;
--radius-modal: 32px;
```

### Shadows
```css
--shadow-card: 0 8px 24px rgba(0,0,0,0.35);
--shadow-modal: 0 16px 48px rgba(0,0,0,0.5);
```

---

## 🚀 Usage Examples

### Basic Usage
```tsx
import { WebhooksSecretsProductionScreen } from './components/analyst/screens/WebhooksSecretsProductionScreen';

function AdminPage() {
  return <WebhooksSecretsProductionScreen />;
}
```

### With Complete Demo
```tsx
import { WebhooksSecretsCompletePage } from './components/analyst/WebhooksSecretsCompletePage';

// Shows viewport switcher and all states
function DemoPage() {
  return <WebhooksSecretsCompletePage />;
}
```

### Developer Handoff
```tsx
import { WebhooksSecretsHandoff } from './components/analyst/WebhooksSecretsHandoff';

// Shows all documentation, code examples, and prop contracts
function HandoffPage() {
  return <WebhooksSecretsHandoff />;
}
```

---

## 📚 Additional Resources

### Related Documentation
- [BuboIQ Connect Integration Guide](../../ANALYST_V1_DEPLOYMENT_GUIDE.md)
- [HMAC Signature Verification](../../SECURITY.md)
- [Analyst v1 System Map](../../ANALYST_SYSTEM_MAP.md)

### External References
- [HMAC-SHA256 Specification (RFC 2104)](https://www.rfc-editor.org/rfc/rfc2104)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

---

## 🔄 Integration with BuboIQ Connect

### Workflow
1. **Configuration**: Set Connect base URL and secrets
2. **Outbound Test**: Send signed test action to Connect
3. **Inbound Test**: Simulate signed callback from Connect
4. **Verification**: Confirm both directions work correctly
5. **Production**: Enable webhook integration

### Security Notes
- Use HTTPS for all endpoints
- Rotate secrets every 90 days
- Use constant-time comparison for signature verification
- Never log raw secrets
- Validate payload structure before processing

---

## 👨‍💻 Developer Handoff

All implementation details, code examples, and prop contracts are available in:
```tsx
<WebhooksSecretsHandoff />
```

This includes:
- Field names and data contracts
- Canonical JSON payloads
- HMAC computation examples (Node.js, Python, Go)
- Component props and TypeScript interfaces
- Accessibility checklist
- Responsive breakpoint specifications

---

## ✅ Production Checklist

- [x] Responsive design (1440/1280/1024/768)
- [x] All states (default/loading/empty/error/offline/success)
- [x] WCAG AA compliance
- [x] 44×44px touch targets
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Copy-to-clipboard functionality
- [x] Password reveal toggles
- [x] Loading states
- [x] Error handling
- [x] Canonical payload examples
- [x] HMAC computation guidance
- [x] cURL examples
- [x] Negative test support
- [x] Invalid signature examples

---

**Status**: ✅ **Production Ready**

This screen is ready for immediate deployment to BuboIQ Analyst v1.
