# Legal Compliance Status - Kerados

**Last Updated:** February 9, 2026

## ✅ COMPLETED

### 1. Privacy Policy
- ✅ GDPR compliant (Art. 6, 7, 13-15, 17-20)
- ✅ CCPA/CPRA compliant
- ✅ Data retention policies
- ✅ Breach notification procedures
- ✅ International data transfer clauses
- Location: `/legal/privacy`

### 2. Security Measures
- ✅ Rate limiting (3/min, 50/hr, 200/day)
- ✅ XSS protection (bleach sanitization)
- ✅ SQL injection protection (parameterized queries)
- ✅ Email injection prevention
- ✅ Request size limits (1MB max)
- ✅ HTTPS/TLS encryption

## ⚠️ URGENT - MUST COMPLETE

### 3. Terms of Service [TODO]
**Priority:** HIGH
**Status:** Template ready, needs customization
**Action:** Review and publish to `/legal/terms`

### 4. Waitlist Form Consent [TODO]
**Priority:** CRITICAL
**Status:** Needs implementation
**Requirements:**
- [ ] Add opt-in checkbox (unchecked by default)
- [ ] Add "Notice at Collection" text before form
- [ ] Separate marketing consent checkbox
- [ ] Update database schema for consent tracking
- [ ] Update API to store consent preferences

**Notice Text to Add:**
```
By joining our waitlist, we will collect your name and email to notify you when Kerados launches. We will not sell your information. See our Privacy Policy for details. You can withdraw consent at any time by emailing privacy@kerados.com.
```

### 5. CCPA "Do Not Sell" Link [TODO]
**Priority:** HIGH (if California users)
**Status:** Needs implementation
**Action:** Add to footer: "Do Not Sell or Share My Personal Information"

### 6. Supabase DPA [TODO - USER ACTION REQUIRED]
**Priority:** CRITICAL
**Status:** Must be signed by user
**Action:**
1. Log into Supabase dashboard
2. Go to Settings → Data Protection
3. Sign Data Processing Agreement
4. Download copy for records

**Why:** Required by GDPR Art. 28 for all data processors

### 7. Data Breach Response Plan [TODO]
**Priority:** HIGH
**Document:** `/BREACH_RESPONSE.md`
**Requirements:**
- 72-hour notification procedure (GDPR)
- Contact list (legal, technical, communications)
- Notification templates
- Incident log format

## 📋 DATABASE SCHEMA UPDATE NEEDED

Current `waitlist` table missing:
```sql
ALTER TABLE waitlist ADD COLUMN consent_marketing BOOLEAN DEFAULT FALSE;
ALTER TABLE waitlist ADD COLUMN consent_timestamp TIMESTAMP WITH TIME ZONE;
ALTER TABLE waitlist ADD COLUMN consent_ip VARCHAR(45);
ALTER TABLE waitlist ADD COLUMN ccpa_opt_out BOOLEAN DEFAULT FALSE;
```

## 📧 EMAIL COMPLIANCE (When Sending Emails)

### CAN-SPAM Act Requirements:
- [ ] Physical postal address in every email
- [ ] Clear "Unsubscribe" link
- [ ] Honor opt-outs within 10 business days
- [ ] Label as "Advertisement" if promotional
- [ ] Accurate "From" and "Subject" lines

**Penalty:** $51,744 per violating email

## ⚙️ CCPA/CPRA 2026 Requirements

### If Annual Revenue > $25M OR Data of 100K+ Users:
- [ ] Privacy risk assessments (by Dec 31, 2027)
- [ ] Cybersecurity audits (annual, by 2028-2030 based on revenue)
- [ ] ADMT disclosures (if using AI for decisions)
- [ ] Vendor inventory and classification
- [ ] Consumer rights request portal

**Status:** Not yet applicable (pre-launch)
**Monitor:** When approaching thresholds

## 🎯 LAUNCH CHECKLIST

Before going live:
1. ✅ Privacy Policy published
2. ⚠️  Terms of Service published
3. ⚠️  Consent checkboxes added to form
4. ⚠️  Database updated for consent tracking
5. ⚠️  CCPA opt-out link added
6. ⚠️  Supabase DPA signed
7. ⚠️  Breach response plan documented
8. ✅ Cookie banner functional
9. ✅ Rate limiting active
10. ✅ Security measures implemented

## 📞 CONTACT SETUP

Required contact points:
- **Privacy Email:** privacy@kerados.com (setup required)
- **Support Email:** support@kerados.com (setup required)
- **Physical Address:** [REQUIRED - add for CCPA/CAN-SPAM]

## 🔄 ONGOING COMPLIANCE

### Quarterly:
- Review and update legal pages
- Vendor DPA renewals
- Security audit

### Annually:
- Privacy policy review
- Consent mechanism testing
- Data retention cleanup
- Rights request log review

### As Needed:
- Breach notifications (72 hours)
- Rights requests (30-45 days)
- Legal updates

## 💰 POTENTIAL PENALTIES

| Violation | Max Penalty |
|-----------|-------------|
| GDPR breach notification delay | €10M or 2% revenue |
| GDPR consent violations | €20M or 4% revenue |
| CCPA intentional violations | $7,500 per violation |
| CCPA unintentional | $2,500 per violation |
| CAN-SPAM per email | $51,744 |
| ADA lawsuits | $10K-$100K+ settlements |

## 📚 RESOURCES

- GDPR Full Text: https://gdpr-info.eu
- CCPA/CPRA Text: https://cppa.ca.gov
- CAN-SPAM Compliance: https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**DISCLAIMER:** This document is for internal use only and does not constitute legal advice. Consult with a qualified attorney for legal compliance guidance.
