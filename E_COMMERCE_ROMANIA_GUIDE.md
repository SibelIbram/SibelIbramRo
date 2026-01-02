# E-Commerce Implementation Guide for Romania
## Payment Processing, GDPR Compliance & Business Requirements

This comprehensive guide covers everything needed to implement a professional e-commerce store for the Romanian market, including payment processing, GDPR compliance, and legal requirements.

---

## Table of Contents

1. [Romanian Payment Gateways](#1-romanian-payment-gateways)
2. [Payment Methods Popular in Romania](#2-payment-methods-popular-in-romania)
3. [GDPR Compliance Requirements](#3-gdpr-compliance-requirements)
4. [Customer Data Storage & Management](#4-customer-data-storage--management)
5. [Romanian Business & Legal Requirements](#5-romanian-business--legal-requirements)
6. [Technical Implementation Architecture](#6-technical-implementation-architecture)
7. [Security & PCI Compliance](#7-security--pci-compliance)
8. [Data Retention Policies](#8-data-retention-policies)
9. [Implementation Checklist](#9-implementation-checklist)

---

## 1. Romanian Payment Gateways

### 1.1 Recommended Payment Processors for Romania

#### **A. PayU Romania** (RECOMMENDED - Market Leader)
**Why Choose PayU:**
- Market leader in Romania with highest adoption rate
- PCI DSS Level 1 certified
- Supports all major Romanian payment methods
- Excellent local support (Romanian language)
- Competitive fees for Romanian market

**Features:**
- Credit/Debit cards (Visa, Mastercard, Maestro)
- Google Pay & Apple Pay
- Buy Now, Pay Later (BNPL) - Leanpay, Mokka integration
- Installment payments (rate fără dobândă)
- Bank transfers (transfer bancar)
- Cash on delivery (ramburs) - if applicable
- Multi-currency: RON, EUR, USD
- Recurring payments support
- Fraud detection & prevention

**Fees:**
- Card payments: ~2.4% + 0.5 RON per transaction
- Bank transfers: Lower fees (~1-2%)
- Setup fee: Usually waived for small businesses
- Monthly fee: Varies by plan

**Integration:**
- REST API
- JavaScript SDK
- Webhooks for payment notifications
- Documentation in Romanian & English
- Test environment available

**Website:** https://romania.payu.com/

---

#### **B. EuPlătesc** (Local Romanian Solution)
**Why Choose EuPlătesc:**
- 100% Romanian company
- Deep understanding of local market
- Excellent customer support in Romanian
- Competitive pricing

**Features:**
- Visa, Mastercard, Maestro
- Bank transfers
- Multi-currency (RON, EUR)
- Recurring payments
- Mobile payments

**Fees:**
- Similar to PayU (~2.4-2.9% + fixed fee)
- Negotiable for higher volumes

**Website:** https://www.euplatesc.ro/

---

#### **C. Fondy** (International with Strong Romania Support)
**Why Choose Fondy:**
- Supports 300+ payment methods
- 150+ currencies
- 19 languages (including Romanian)
- Good for international expansion

**Features:**
- All major card types
- Apple Pay, Google Pay
- Bank transfers
- Multi-currency
- Adaptive payment pages

**Fees:**
- Competitive rates
- Transparent pricing

**Website:** https://fondy.eu/en-ro/

---

#### **D. Stripe** (International Option)
**Why Choose Stripe:**
- Excellent developer experience
- Strong API documentation
- Global reach
- Advanced features

**Considerations:**
- Less popular in Romania (lower adoption)
- May need additional payment methods
- Higher fees for Romanian market
- English support primarily

**Fees:**
- 2.9% + 0.30 EUR per transaction
- Additional fees for international cards

---

### 1.2 Payment Gateway Comparison

| Feature | PayU Romania | EuPlătesc | Fondy | Stripe |
|-----------------|----------------|-----------|-------|--------|
| **Market Share in RO** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Romanian Support** | ✅ Excellent | ✅ Excellent | ✅ Good | ⚠️ Limited |
| **BNPL Support** | ✅ Yes | ⚠️ Limited | ✅ Yes | ⚠️ Limited |
| **Bank Transfers** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Installments** | ✅ Yes | ⚠️ Limited | ✅ Yes | ❌ No |
| **Developer Docs** | ✅ Good | ✅ Good | ✅ Good | ⭐⭐⭐⭐⭐ |
| **Fees** | Competitive | Competitive | Competitive | Higher |
| **PCI Compliance** | ✅ Level 1 | ✅ Level 1 | ✅ Level 1 | ✅ Level 1 |

**Recommendation:** **PayU Romania** for best market fit and local support.

---

## 2. Payment Methods Popular in Romania

### 2.1 Credit/Debit Cards
- **Visa** - Most popular
- **Mastercard** - Very popular
- **Maestro** - Popular for debit cards
- **American Express** - Less common, but some customers use it

### 2.2 Buy Now, Pay Later (BNPL)
**Growing rapidly in Romania:**
- **Leanpay** - Popular Romanian BNPL service
- **Mokka** - Another local favorite
- **Klarna** - International, gaining traction

**Why Important:** Romanian consumers increasingly prefer installment payments, especially for higher-value items.

### 2.3 Bank Transfers
- **Direct bank transfer** (transfer bancar)
- **Open Banking** (PIS - Payment Initiation Service)
- Popular for larger purchases
- Lower fees for merchants

### 2.4 Digital Wallets
- **Google Pay** - Growing adoption
- **Apple Pay** - iPhone users
- **PayPal** - Less common in Romania, but some use it

### 2.5 Cash on Delivery (Ramburs)
- Still popular in Romania
- Requires logistics partner
- Higher risk for merchants
- Consider for local deliveries only

---

## 3. GDPR Compliance Requirements

### 3.1 Legal Basis for Data Processing

**For E-commerce, you need:**

1. **Contractual Necessity** (Art. 6(1)(b) GDPR)
   - Processing necessary to fulfill order
   - Customer name, address, payment info
   - **No consent needed** - this is lawful basis

2. **Legal Obligation** (Art. 6(1)(c) GDPR)
   - Invoice data (required by Romanian tax law)
   - Accounting records (10 years retention)
   - **No consent needed**

3. **Consent** (Art. 6(1)(a) GDPR)
   - Marketing emails
   - Analytics cookies (non-essential)
   - Newsletter subscriptions
   - **Explicit consent required**

4. **Legitimate Interest** (Art. 6(1)(f) GDPR)
   - Fraud prevention
   - Security measures
   - Customer support
   - **Must balance with customer rights**

---

### 3.2 Required GDPR Documentation

#### **A. Privacy Policy (Politică de Confidențialitate)**
**Must include:**
- Identity of data controller (your business)
- Contact details of Data Protection Officer (if applicable)
- What data you collect
- Why you collect it (legal basis)
- How long you keep it
- Who you share it with
- Customer rights (access, rectification, erasure, portability, objection)
- Right to lodge complaint with ANSPDCP
- **Must be in Romanian** (or bilingual Romanian/English)

#### **B. Cookie Policy**
**Must include:**
- Types of cookies used
- Purpose of each cookie
- Duration (session/persistent)
- Third-party cookies (payment processors, analytics)
- How to manage/disable cookies

#### **C. Terms & Conditions (Termeni și Condiții)**
**Must include:**
- Product/service descriptions
- Pricing (including VAT)
- Payment terms
- Delivery terms
- Return/refund policy
- Warranty information
- Dispute resolution

#### **D. Data Processing Agreement (DPA)**
**Required with:**
- Payment processors
- Email service providers
- Cloud storage providers (Firebase)
- Shipping companies
- Any third-party processing personal data

---

### 3.3 Customer Rights Under GDPR

You **must** provide mechanisms for customers to exercise:

#### **1. Right of Access (Art. 15)**
- Customer can request copy of all their data
- Must provide within 30 days
- Free of charge (unless excessive requests)

**Implementation:**
- "Download My Data" button in account settings
- Export to JSON/CSV format
- Include: orders, profile, addresses, payment methods (tokens only)

#### **2. Right to Rectification (Art. 16)**
- Customer can correct inaccurate data
- Must update within 30 days

**Implementation:**
- Edit profile functionality
- Update address/contact info
- Self-service account management

#### **3. Right to Erasure "Right to be Forgotten" (Art. 17)**
- Customer can request deletion
- **Exceptions:** Legal obligations (invoices must be kept 10 years)
- Must delete within 30 days

**Implementation:**
- "Delete My Account" option
- Anonymize order data (keep for accounting, remove personal identifiers)
- Delete marketing data immediately
- Keep invoice data (legal requirement)

#### **4. Right to Data Portability (Art. 20)**
- Customer can request data in structured format
- Must provide within 30 days
- Machine-readable format (JSON, CSV, XML)

**Implementation:**
- Export functionality
- Include all customer data
- Standard format (JSON recommended)

#### **5. Right to Object (Art. 21)**
- Customer can object to processing
- Especially for marketing/direct marketing
- Must stop processing immediately

**Implementation:**
- Unsubscribe from marketing emails
- Opt-out of analytics
- Privacy settings in account

#### **6. Right to Restrict Processing (Art. 18)**
- Customer can request restriction
- While dispute is resolved

**Implementation:**
- Flag account as "restricted"
- Stop all processing except legal requirements

---

### 3.4 Consent Management

#### **Explicit Consent Requirements:**
- ✅ **Clear and specific** - what exactly are you asking for?
- ✅ **Granular** - separate consent for different purposes
- ✅ **Easy to withdraw** - one-click unsubscribe
- ✅ **No pre-ticked boxes** - must be opt-in
- ✅ **Documented** - record when/how consent was given

#### **Consent for Marketing:**
```
☐ I agree to receive marketing emails about products and promotions
☐ I agree to receive SMS notifications
☐ I agree to personalized product recommendations
```

**Each checkbox must be:**
- Separate (not bundled)
- Optional (not required for purchase)
- Easy to uncheck later

#### **Cookie Consent:**
- Show cookie banner on first visit
- Categorize cookies (essential, analytics, marketing)
- Allow granular control
- Remember user preferences

---

### 3.5 Data Breach Notification

**If data breach occurs:**

1. **Notify ANSPDCP within 72 hours**
   - Romanian: Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
   - Website: https://www.dataprotection.ro/
   - Email: anspdcp@dataprotection.ro

2. **Notify affected customers** (if high risk)
   - Without undue delay
   - Clear language
   - Explain what happened
   - What you're doing about it
   - What they should do

**Breach includes:**
- Unauthorized access to database
- Lost/stolen devices with customer data
- Accidental disclosure
- Ransomware attacks

---

## 4. Customer Data Storage & Management

### 4.1 What Data You Can Store

#### **Order Processing (Contractual Necessity):**
✅ **Required:**
- Full name
- Email address
- Phone number
- Shipping address
- Billing address (if different)
- Order details (items, quantities, prices)
- Payment method (type only, NOT card numbers)
- Payment transaction ID
- Order status
- Delivery tracking

✅ **Payment Data:**
- **DO NOT STORE:** Credit card numbers, CVV, full card details
- **CAN STORE:** Payment method type (Visa, Mastercard), last 4 digits (for display), payment processor token (encrypted)

#### **Legal Requirements (Invoice/Accounting):**
✅ **Required for 10 years:**
- Invoice number
- Invoice date
- Customer name (for B2B: company name, CUI)
- Customer address
- Items purchased
- Prices (including VAT)
- Total amount
- Payment confirmation

**Note:** After 10 years, you can anonymize this data (remove personal identifiers, keep aggregated sales data).

#### **Marketing (Requires Consent):**
⚠️ **Only with explicit consent:**
- Email for newsletters
- Phone for SMS marketing
- Preferences/interests
- Purchase history (for recommendations)

#### **Analytics (Requires Consent or Legitimate Interest):**
⚠️ **With consent or anonymized:**
- Browsing behavior (anonymized)
- Page views (anonymized IP)
- Device type, browser (non-identifying)

---

### 4.2 Data Storage Architecture

#### **Firebase Firestore Collections:**

```
users/
  {userId}/
    - email: string
    - name: string
    - phone: string (optional)
    - createdAt: timestamp
    - lastLogin: timestamp
    - marketingConsent: boolean
    - analyticsConsent: boolean
    - dataProcessingConsent: timestamp
    - gdprRights: {
        dataExportRequested: boolean
        dataExportDate: timestamp
        deletionRequested: boolean
        deletionDate: timestamp
      }

shippingAddresses/
  {addressId}/
    - userId: string (reference)
    - name: string
    - phone: string
    - address: string
    - city: string
    - county: string (județ)
    - postalCode: string
    - country: string
    - isDefault: boolean
    - createdAt: timestamp

orders/
  {orderId}/
    - userId: string (reference, nullable for guest)
    - orderNumber: string (unique)
    - status: string (pending, paid, processing, shipped, delivered, cancelled)
    - items: array of {
        productId: string
        productName: string
        quantity: number
        price: number
        vat: number
      }
    - subtotal: number
    - shipping: number
    - vat: number
    - total: number
    - currency: string (RON)
    - shippingAddress: object (copy at time of order)
    - billingAddress: object (copy at time of order)
    - paymentMethod: string (card, bank_transfer, etc.)
    - paymentTransactionId: string
    - paymentStatus: string (pending, completed, failed, refunded)
    - invoiceNumber: string (generated)
    - createdAt: timestamp
    - updatedAt: timestamp
    - gdprAnonymized: boolean (for deletion requests)

invoices/
  {invoiceId}/
    - orderId: string (reference)
    - invoiceNumber: string (unique, sequential)
    - customerName: string
    - customerAddress: object
    - customerCUI: string (if B2B)
    - items: array (copy from order)
    - subtotal: number
    - vat: number
    - total: number
    - issueDate: timestamp
    - dueDate: timestamp
    - paymentDate: timestamp (nullable)
    - pdfUrl: string (Firebase Storage)
    - retentionUntil: timestamp (10 years from issue)

paymentTokens/
  {tokenId}/
    - userId: string (reference)
    - paymentProcessor: string (payu, stripe, etc.)
    - token: string (encrypted)
    - last4: string (last 4 digits of card)
    - cardType: string (Visa, Mastercard)
    - expiryMonth: number
    - expiryYear: number
    - isDefault: boolean
    - createdAt: timestamp
    - encrypted: boolean = true

gdprRequests/
  {requestId}/
    - userId: string (reference)
    - requestType: string (access, rectification, erasure, portability)
    - status: string (pending, processing, completed, rejected)
    - requestedAt: timestamp
    - completedAt: timestamp (nullable)
    - responseData: string (encrypted, for data export)
    - notes: string
```

---

### 4.3 Data Encryption Requirements

#### **At Rest (Firebase):**
- ✅ Firebase Firestore encrypts data at rest by default
- ✅ Firebase Storage encrypts files at rest
- ✅ Use Firebase Security Rules to restrict access

#### **In Transit:**
- ✅ HTTPS only (enforced by Netlify)
- ✅ TLS 1.2+ for all API calls
- ✅ Secure WebSocket for real-time updates

#### **Sensitive Data:**
- ✅ Encrypt payment tokens before storing
- ✅ Use Firebase Admin SDK for server-side encryption
- ✅ Never log sensitive data
- ✅ Hash passwords (Firebase Auth handles this)

#### **Encryption Implementation:**
```javascript
// Example: Encrypt payment token before storing
const crypto = require('crypto');

function encryptPaymentToken(token, encryptionKey) {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}
```

---

### 4.4 Data Access Controls

#### **Firebase Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users can only read/update their own data
    match /users/{userId} {
      allow read, update: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Shipping addresses - user's own addresses only
    match /shippingAddresses/{addressId} {
      allow read, write: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
    }
    
    // Orders - users can read their own orders
    match /orders/{orderId} {
      allow read: if isAuthenticated() 
        && (resource.data.userId == request.auth.uid || resource.data.userId == null);
      allow create: if isAuthenticated();
      // Updates only by admin (server-side)
      allow update: if false; // Only via server functions
    }
    
    // Invoices - users can read their own invoices
    match /invoices/{invoiceId} {
      allow read: if isAuthenticated() 
        && resource.data.orderId in get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data
        && get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.userId == request.auth.uid;
      allow create: if false; // Only via server functions
    }
    
    // Payment tokens - user's own tokens only, encrypted
    match /paymentTokens/{tokenId} {
      allow read: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.encrypted == true;
      allow delete: if isAuthenticated() 
        && resource.data.userId == request.auth.uid;
    }
    
    // GDPR requests - user's own requests only
    match /gdprRequests/{requestId} {
      allow read, create: if isAuthenticated() 
        && request.resource.data.userId == request.auth.uid;
      allow update: if false; // Only via server functions
    }
    
    // Products - public read, admin write
    match /products/{productId} {
      allow read: if resource.data.published == true || isAuthenticated();
      allow write: if isAuthenticated(); // Admin check server-side
    }
  }
}
```

---

## 5. Romanian Business & Legal Requirements

### 5.1 Business Registration

**Required:**
- ✅ **CUI (Cod Unic de Înregistrare)** - Unique Registration Code
- ✅ **RO number** - Romanian company registration
- ✅ Business license (if applicable to your industry)
- ✅ VAT registration (if turnover > threshold)

**For E-commerce:**
- Must register with Romanian Trade Register
- Obtain authorization for online sales
- Register for VAT (if applicable)

---

### 5.2 VAT (TVA) Requirements

#### **VAT Registration:**
- **Mandatory if:** Annual turnover > 300,000 RON (~60,000 EUR)
- **Voluntary:** Can register even below threshold
- **VAT Rate:** 19% (standard), 9% (reduced for some products), 5% (special cases)

#### **VAT on Invoices:**
**Must include:**
- Your VAT number (CUI with RO prefix)
- Customer VAT number (if B2B)
- VAT amount separately displayed
- VAT rate applied
- Total including VAT

#### **Invoice Requirements (Romanian Law):**
**Mandatory fields:**
1. Invoice number (sequential, unique)
2. Invoice date
3. Your company details:
   - Company name
   - CUI (RO number)
   - Address
   - Bank account (IBAN)
4. Customer details:
   - Name (individual) or Company name + CUI (B2B)
   - Address
5. Product/service description
6. Quantity
7. Unit price (excluding VAT)
8. VAT rate
9. VAT amount
10. Total amount (including VAT)
11. Payment method
12. Payment terms

#### **Electronic Invoices:**
- Can be digital (PDF)
- Must be stored for 10 years
- Must be accessible to customers
- Can use e-Invoice system (RO e-Factura) if B2B

---

### 5.3 Consumer Protection (Romanian Law)

#### **Right of Withdrawal (Dreptul de retragere):**
- **14 days** from delivery (EU law)
- **No reason required**
- **Exceptions:** Customized products, perishables, sealed software
- Must refund within 14 days of receiving returned item

#### **Return Policy:**
**Must clearly state:**
- Return period (14 days)
- Return conditions (unused, original packaging)
- Who pays return shipping
- Refund timeline
- Return address

#### **Warranty:**
- **Legal warranty:** 2 years (EU law)
- Must repair, replace, or refund
- Burden of proof on seller for first 6 months

---

### 5.4 Distance Selling Requirements

**Must provide before purchase:**
- ✅ Clear product description
- ✅ Total price (including VAT, shipping)
- ✅ Delivery timeframes
- ✅ Payment methods accepted
- ✅ Return policy
- ✅ Contact information
- ✅ Company registration details (CUI)

**After purchase:**
- ✅ Order confirmation email
- ✅ Invoice (within 15 days)
- ✅ Delivery tracking (if applicable)

---

### 5.5 Data Protection Authority

**ANSPDCP** (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal)
- **Website:** https://www.dataprotection.ro/
- **Email:** anspdcp@dataprotection.ro
- **Phone:** +40 318 059 211

**Must register if:**
- Processing sensitive data
- Large-scale processing
- Regular monitoring
- **For e-commerce:** Usually not required, but must comply with GDPR

---

## 6. Technical Implementation Architecture

### 6.1 Payment Processing Flow

#### **Step 1: Create Payment Intent**
```javascript
// Netlify Function: create-payment-intent.js
// Server-side only (secure)

exports.handler = async (event, context) => {
  // 1. Validate order data
  // 2. Calculate totals (including VAT)
  // 3. Create payment intent with PayU/Stripe
  // 4. Return payment intent ID
  // 5. Store order as "pending" in Firestore
};
```

#### **Step 2: Client-Side Payment**
```javascript
// Frontend: checkout.js
// 1. Initialize payment SDK (PayU/Stripe)
// 2. Collect payment method from customer
// 3. Confirm payment with payment intent
// 4. Handle 3D Secure if required
```

#### **Step 3: Webhook Handler**
```javascript
// Netlify Function: payment-webhook.js
// Receives payment confirmation from processor

exports.handler = async (event, context) => {
  // 1. Verify webhook signature (security)
  // 2. Update order status in Firestore
  // 3. Generate invoice
  // 4. Send confirmation email
  // 5. Update inventory
};
```

---

### 6.2 Invoice Generation

#### **Required Components:**
1. **Invoice Number Generator**
   - Sequential, unique
   - Format: INV-YYYY-XXXXX (e.g., INV-2025-00001)
   - Store last number in Firestore

2. **Invoice Template**
   - HTML template with all required fields
   - Romanian language
   - Company logo
   - VAT breakdown

3. **PDF Generation**
   - Use library: `pdfkit`, `puppeteer`, or `jsPDF`
   - Store in Firebase Storage
   - Link in Firestore invoice document

4. **Email Delivery**
   - Attach PDF to order confirmation email
   - Also available in customer account

---

### 6.3 GDPR Implementation Features

#### **A. Consent Management System**
```javascript
// consent-manager.js
class ConsentManager {
  // Track consent for:
  // - Marketing emails
  // - Analytics cookies
  // - Data processing
  
  recordConsent(userId, consentType, granted, timestamp) {
    // Store in Firestore with timestamp
    // Required for GDPR compliance
  }
  
  withdrawConsent(userId, consentType) {
    // Update consent status
    // Stop processing immediately
  }
}
```

#### **B. Data Export Functionality**
```javascript
// Netlify Function: export-user-data.js
exports.handler = async (event, context) => {
  // 1. Get all user data from Firestore
  // 2. Format as JSON
  // 3. Encrypt sensitive data
  // 4. Generate download link
  // 5. Email to user
  // 6. Log request in gdprRequests collection
};
```

#### **C. Data Deletion Functionality**
```javascript
// Netlify Function: delete-user-data.js
exports.handler = async (event, context) => {
  // 1. Anonymize order data (keep for accounting)
  // 2. Delete marketing data
  // 3. Delete user profile
  // 4. Delete shipping addresses
  // 5. Keep invoices (legal requirement)
  // 6. Log deletion in gdprRequests
};
```

---

### 6.4 Required Netlify Functions

```
netlify/functions/
├── create-payment-intent.js      # Initialize payment
├── payment-webhook.js            # Handle payment confirmation
├── create-order.js               # Create order after payment
├── generate-invoice.js           # Generate invoice PDF
├── export-user-data.js           # GDPR data export
├── delete-user-data.js           # GDPR data deletion
├── update-consent.js             # Update user consent
└── send-order-email.js           # Send order confirmation
```

---

## 7. Security & PCI Compliance

### 7.1 PCI DSS Compliance

**You DON'T need full PCI compliance if:**
- ✅ You use a payment processor (PayU, Stripe, etc.)
- ✅ You never touch card data
- ✅ All payment processing happens via processor's secure form/API

**You DO need:**
- ✅ Secure connection (HTTPS)
- ✅ Secure API endpoints
- ✅ No storage of card data
- ✅ Secure handling of payment tokens

**Payment Processor handles:**
- ✅ Card data collection
- ✅ Card data storage (encrypted)
- ✅ Payment processing
- ✅ PCI DSS Level 1 compliance

---

### 7.2 Security Best Practices

#### **API Security:**
- ✅ Use environment variables for API keys
- ✅ Never expose secret keys in client code
- ✅ Verify webhook signatures
- ✅ Rate limiting on API endpoints
- ✅ Input validation (server-side)

#### **Authentication:**
- ✅ Firebase Auth (already implemented)
- ✅ Strong password requirements
- ✅ Two-factor authentication (optional, recommended)
- ✅ Session management
- ✅ Secure logout

#### **Data Protection:**
- ✅ Encrypt sensitive data at rest
- ✅ Encrypt data in transit (HTTPS)
- ✅ Regular security audits
- ✅ Monitor for breaches
- ✅ Backup and disaster recovery

---

## 8. Data Retention Policies

### 8.1 Retention Periods

#### **Order Data:**
- **Active orders:** Keep until order completed + 30 days
- **Completed orders:** Keep for 10 years (accounting requirement)
- **After 10 years:** Anonymize (remove personal identifiers, keep aggregated data)

#### **Invoice Data:**
- **Retention:** 10 years (Romanian tax law)
- **After 10 years:** Can delete or anonymize
- **Storage:** Firebase Storage (PDFs) + Firestore (metadata)

#### **User Accounts:**
- **Active users:** Keep while account active
- **Inactive users:** 
  - Delete after 3 years of inactivity (if no orders)
  - Keep if has order history (for accounting)
- **Marketing data:** Delete immediately upon consent withdrawal

#### **Payment Tokens:**
- **Active tokens:** Keep while user has account
- **Delete:** When user deletes account or requests deletion
- **Exception:** Keep transaction IDs (required for accounting)

#### **GDPR Requests:**
- **Retention:** 3 years (proof of compliance)
- **Then:** Delete or anonymize

#### **Analytics Data:**
- **Retention:** 26 months (Google Analytics default)
- **Or:** As per your analytics provider
- **Anonymize:** IP addresses immediately

---

### 8.2 Automated Data Cleanup

**Implement scheduled functions:**
```javascript
// Firebase Cloud Function (scheduled)
// Run monthly to clean up old data

exports.cleanupOldData = functions.pubsub
  .schedule('0 0 1 * *') // First day of month
  .onRun(async (context) => {
    // 1. Find inactive users (>3 years, no orders)
    // 2. Anonymize old orders (>10 years)
    // 3. Delete old marketing data
    // 4. Clean up expired payment tokens
  });
```

---

## 9. Implementation Checklist

### Phase 1: Setup & Configuration
- [ ] Choose payment processor (PayU recommended)
- [ ] Register business (CUI, VAT if needed)
- [ ] Set up payment processor account
- [ ] Configure Firebase for e-commerce collections
- [ ] Set up Netlify Functions environment
- [ ] Configure environment variables

### Phase 2: Legal & Compliance
- [ ] Draft Privacy Policy (Romanian + English)
- [ ] Draft Cookie Policy
- [ ] Draft Terms & Conditions
- [ ] Draft Return/Refund Policy
- [ ] Register with ANSPDCP (if required)
- [ ] Set up data processing agreements with vendors

### Phase 3: Payment Integration
- [ ] Implement payment intent creation (server-side)
- [ ] Implement payment form (client-side)
- [ ] Set up webhook handler for payment confirmations
- [ ] Test payment flow (test mode)
- [ ] Implement 3D Secure handling
- [ ] Add payment method selection UI

### Phase 4: Order Management
- [ ] Create order data structure in Firestore
- [ ] Implement order creation flow
- [ ] Implement order status updates
- [ ] Create order history page
- [ ] Create admin order management panel
- [ ] Implement order tracking

### Phase 5: Invoice System
- [ ] Design invoice template
- [ ] Implement invoice number generator
- [ ] Implement PDF generation
- [ ] Set up invoice storage (Firebase Storage)
- [ ] Add invoice download in customer account
- [ ] Email invoices automatically

### Phase 6: GDPR Implementation
- [ ] Implement consent management system
- [ ] Create data export functionality
- [ ] Create data deletion functionality
- [ ] Add privacy settings page
- [ ] Implement cookie consent banner
- [ ] Set up GDPR request logging
- [ ] Create data retention policies
- [ ] Implement automated cleanup

### Phase 7: Customer Features
- [ ] Create product catalog
- [ ] Implement shopping cart
- [ ] Create checkout flow
- [ ] Add shipping address management
- [ ] Create account management page
- [ ] Add order tracking
- [ ] Implement email notifications

### Phase 8: Admin Features
- [ ] Product management (CRUD)
- [ ] Order management dashboard
- [ ] Invoice management
- [ ] Customer management
- [ ] Analytics dashboard
- [ ] Inventory management

### Phase 9: Testing
- [ ] Test payment flow (all methods)
- [ ] Test order creation
- [ ] Test invoice generation
- [ ] Test GDPR features (export, deletion)
- [ ] Test email notifications
- [ ] Test on mobile devices
- [ ] Security testing
- [ ] Load testing

### Phase 10: Launch
- [ ] Switch payment processor to production mode
- [ ] Final legal review
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Set up error tracking
- [ ] Set up analytics

---

## Additional Resources

### Romanian Payment Processors
- **PayU Romania:** https://romania.payu.com/
- **EuPlătesc:** https://www.euplatesc.ro/
- **Fondy:** https://fondy.eu/en-ro/

### Legal & Compliance
- **ANSPDCP:** https://www.dataprotection.ro/
- **GDPR Info:** https://gdpr.eu/
- **Romanian Trade Register:** https://www.onrc.ro/

### Technical Documentation
- **Firebase Security Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Netlify Functions:** https://docs.netlify.com/functions/overview/
- **PayU API Docs:** https://developers.payu.com/

---

## Cost Estimates

### Monthly Costs:
- **Payment Processing:** 2.4-2.9% + 0.5 RON per transaction
- **Firebase:** Free tier usually sufficient (scales with usage)
- **Netlify:** Free tier sufficient for most sites
- **Email Service:** $10-50/month (SendGrid, Resend, etc.)
- **Domain & SSL:** ~$10-20/year

### One-Time Costs:
- **Business Registration:** Varies (consult accountant)
- **Legal Documents:** €500-2000 (lawyer fees)
- **Development:** Varies (if outsourcing)

---

**This guide provides a comprehensive foundation for implementing e-commerce in Romania with full GDPR compliance and proper business practices.**

