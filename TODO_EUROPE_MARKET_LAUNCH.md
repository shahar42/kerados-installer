# TODO: Europe Market Launch - Legal Compliance Checklist

**Created:** February 9, 2026
**Status:** READY TO DEPLOY - All code prepared, manual actions required
**Estimated Time:** 2-3 hours total

---

## ⚠️ CRITICAL - DO BEFORE ACCEPTING EU USERS

**LEGAL RISK:** GDPR fines up to €20M or 4% of global revenue. Complete ALL items before launching in Europe.

---

## ✅ ALREADY PREPARED (Code Ready)

The following files have been updated and are ready to deploy:

### 1. Database Schema
**File:** `supabase_schema.sql`
- Added consent tracking columns (consent_marketing, consent_timestamp, consent_ip, ccpa_opt_out)

### 2. Waitlist Form
**File:** `templates/index.html`
- Added GDPR-compliant privacy notice
- Added required consent checkbox (unchecked by default)
- Added optional marketing consent checkbox
- Added CCPA "Do Not Sell" link to footer

### 3. Styling
**File:** `static/css/styles.css`
- Added form-notice styling (privacy notice box)
- Added checkbox-label styling

### 4. JavaScript
**File:** `static/js/waitlist-modal.js`
- Updated to collect consent preferences

### 5. Backend
**File:** `app.py`
- Added consent validation (blocks signup if required consent not given)
- Stores consent preferences and IP address for GDPR records
- Added CCPA opt-out route

### 6. Legal Pages
**Files:**
- `templates/legal/terms.html` - Updated Terms of Service
- `templates/legal/ccpa-opt-out.html` - NEW: CCPA opt-out page
- `templates/legal/privacy.html` - Already compliant

### 7. Documentation
**File:** `BREACH_RESPONSE_PLAN.md` - NEW: Complete incident response procedures

---

## 🔴 MANUAL ACTIONS REQUIRED (You Must Do These)

### Step 1: Sign Supabase DPA (15 minutes) - CRITICAL
**Why:** GDPR Article 28 requires written Data Processing Agreements with ALL data processors.
**When:** BEFORE accepting any EU user data.

**Actions:**
1. [ ] Log into Supabase dashboard: https://supabase.com/dashboard
2. [ ] Select your Kerados project
3. [ ] Go to **Settings** → **Data Protection** (or **Legal**)
4. [ ] Review the Data Processing Agreement (DPA)
5. [ ] Sign the DPA electronically
6. [ ] Download a copy (PDF)
7. [ ] Create folder: `mkdir -p legal_documents`
8. [ ] Save copy: `legal_documents/Supabase_DPA_[YYYY-MM-DD].pdf`
9. [ ] Document in LEGAL_COMPLIANCE_STATUS.md that DPA is signed

**If Supabase doesn't offer DPA in dashboard:**
- Contact support: https://supabase.com/support
- Request Standard Contractual Clauses (SCCs) for GDPR compliance

---

### Step 2: Update Database Schema (5 minutes) - CRITICAL
**Why:** Without these columns, consent data cannot be stored (GDPR violation).

**Actions:**
1. [ ] Log into Supabase dashboard: https://supabase.com/dashboard
2. [ ] Select your Kerados project
3. [ ] Go to **SQL Editor**
4. [ ] Copy and paste this SQL:

```sql
-- GDPR/CCPA Compliance: Add consent tracking columns
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS consent_ip VARCHAR(45);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ccpa_opt_out BOOLEAN DEFAULT FALSE;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'waitlist'
ORDER BY ordinal_position;
```

5. [ ] Click **Run** or **Execute**
6. [ ] Verify all 4 new columns appear in the result
7. [ ] Screenshot the results and save to `legal_documents/`

---

### Step 3: Set Up Email Addresses (30 minutes)
**Why:** GDPR requires functional contact points for data subject requests.

**Required Email Addresses:**
1. [ ] **privacy@kerados.com** - For GDPR/CCPA requests (CRITICAL)
2. [ ] **legal@kerados.com** - For Terms questions
3. [ ] **support@kerados.com** - For customer support
4. [ ] **security@kerados.com** - For breach notifications

**Setup Options:**
- **Option A:** Set up email forwarding (if using domain registrar)
- **Option B:** Set up Google Workspace/Microsoft 365 business email
- **Option C:** Set up aliases that forward to your main email

**Test Each Email:**
```bash
# Send test email to each address and verify you receive it
echo "Test email for privacy@kerados.com" | mail -s "Test" privacy@kerados.com
```

---

### Step 4: Add Physical Address (15 minutes)
**Why:** Required for CCPA compliance and CAN-SPAM Act when sending marketing emails.

**Where to Add:**
1. [ ] Privacy Policy (`templates/legal/privacy.html`) - Add to "Contact Information" section
2. [ ] Terms of Service (`templates/legal/terms.html`) - Add to "Contact" section
3. [ ] CCPA Opt-Out page (`templates/legal/ccpa-opt-out.html`) - Add to "Contact Information"

**What to Add:**
```
Kerados
[Your Business Address]
[City, State/Region, Postal Code]
[Country]
```

**Notes:**
- Can be a business address, registered agent address, or PO Box
- Must be a physical address (not just email)
- Will be publicly visible on your website

---

### Step 5: Review Breach Response Plan (15 minutes)
**Why:** You need to know what to do if a breach occurs (72-hour GDPR deadline).

**Actions:**
1. [ ] Read `BREACH_RESPONSE_PLAN.md` completely
2. [ ] Fill in contact list (section 5):
   - Your phone number
   - Legal counsel contact (if you have one)
   - Communications lead contact
3. [ ] Identify your lead EU Data Protection Authority:
   - Find at: https://edpb.europa.eu/about-edpb/about-edpb/members_en
   - Choose based on where your main EU establishment is (or Ireland if using US company)
   - Document the contact email
4. [ ] Save an editable copy of user notification template
5. [ ] Set a calendar reminder to review this plan every 6 months

---

## 🚀 DEPLOYMENT STEPS

### Pre-Deployment Checklist:
- [ ] All manual actions above completed
- [ ] Supabase DPA signed
- [ ] Database schema updated
- [ ] Email addresses set up and tested
- [ ] Physical address added to legal pages

### Deployment:

#### 1. Test Locally (15 minutes)
```bash
# Start local server
python app.py

# In browser, visit http://localhost:5000
# Test the following:
# 1. Open waitlist modal
# 2. Try to submit WITHOUT checking required consent → Should show error
# 3. Submit WITH required consent checked → Should succeed
# 4. Visit /legal/privacy → Should load
# 5. Visit /legal/terms → Should load
# 6. Visit /legal/ccpa-opt-out → Should load
# 7. Check footer has "Do Not Sell" link
```

#### 2. Commit Changes
```bash
git status  # Review what changed
git add .
git commit -m "$(cat <<'EOF'
Add GDPR/CCPA legal compliance for EU market launch

ADDED:
- Consent checkbox system (required + optional marketing)
- Privacy notice at collection
- CCPA "Do Not Sell My Personal Information" page
- Consent tracking in database (IP, timestamp, preferences)
- Breach response plan documentation
- Updated Terms of Service for Kerados

UPDATED:
- Waitlist form with GDPR-compliant consent flow
- Backend validates consent before accepting signups
- Database schema with consent columns
- All legal pages updated for compliance

CRITICAL: Before deploying, ensure Supabase DPA is signed
and database schema is updated (see TODO_EUROPE_MARKET_LAUNCH.md)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

#### 3. Deploy to Render
```bash
git push origin refactor/modular-architecture

# Monitor deployment at https://dashboard.render.com
# Check logs for any errors
```

#### 4. Verify Production (10 minutes)
Once deployed:
- [ ] Visit production URL
- [ ] Test waitlist signup flow (with/without consent)
- [ ] Verify all legal pages load correctly
- [ ] Test on mobile device
- [ ] Check footer link to CCPA opt-out

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Database Check:
```bash
# Use view_waitlist.py or Supabase dashboard
python view_waitlist.py

# Verify new signups show:
# - consent_marketing (true/false)
# - consent_timestamp (timestamp)
# - consent_ip (IP address)
# - ccpa_opt_out (false)
```

### User Flow Check:
1. [ ] Submit waitlist signup with consent → Success
2. [ ] Try without consent → Error message shown
3. [ ] Check database → New fields populated correctly
4. [ ] Test "Do Not Sell" link → Page loads
5. [ ] Privacy Policy link from notice → Opens in new tab

---

## 📧 ONGOING COMPLIANCE (After Launch)

### Monthly:
- [ ] Review privacy policy for accuracy
- [ ] Check that email addresses are monitored
- [ ] Review any data subject requests (respond within 30 days)

### Quarterly:
- [ ] Security audit of systems
- [ ] Review breach response plan
- [ ] Check Supabase DPA is still valid

### Annually:
- [ ] Full legal compliance review
- [ ] Update legal pages if regulations changed
- [ ] Consider cyber liability insurance (~$1-3K/year)

---

## 🆘 IF YOU GET A DATA SUBJECT REQUEST

**Common Requests:**
1. **Right of Access** - "Show me my data"
2. **Right to Deletion** - "Delete my data"
3. **Right to Rectification** - "Correct my data"
4. **Right to Withdraw Consent** - "Stop using my data"

**How to Respond:**
1. Verify identity (ask for email confirmation)
2. Respond within **30 days** (GDPR) or **45 days** (CCPA)
3. Use Supabase dashboard or `view_waitlist.py` to:
   - Export user data (Right of Access)
   - Delete user record (Right to Deletion)
   - Update user record (Right to Rectification)
4. Confirm action taken via email
5. Document the request in a log

**Template Response:**
```
Subject: Data Request - Confirmation

Dear [Name],

We have received your request to [access/delete/correct] your personal data.

We have completed your request:
[Details of action taken]

If you have any questions, please contact privacy@kerados.com.

Best regards,
Kerados Privacy Team
```

---

## 💰 COST SUMMARY

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| Supabase DPA | FREE | One-time | Included with service |
| Email addresses | $6-12/mo | Monthly | Google Workspace or similar |
| Legal review (optional) | $500-2000 | One-time | Attorney review of policies |
| Cyber insurance (optional) | $1000-3000 | Annual | Recommended for breach coverage |

**Total:** ~$100-200 to get started (if using email forwarding), ~$150-200/year ongoing

---

## 📚 RESOURCES

- **GDPR Full Text:** https://gdpr-info.eu
- **CCPA/CPRA Text:** https://cppa.ca.gov
- **EU Data Protection Authorities:** https://edpb.europa.eu/about-edpb/about-edpb/members_en
- **Supabase Security:** https://supabase.com/security
- **CAN-SPAM Act:** https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business

---

## 🎯 LAUNCH CHECKLIST SUMMARY

**Before announcing in Europe:**
- [ ] Supabase DPA signed ✓
- [ ] Database schema updated ✓
- [ ] Email addresses set up ✓
- [ ] Physical address added ✓
- [ ] Code deployed ✓
- [ ] Production tested ✓
- [ ] Breach response plan reviewed ✓
- [ ] Team trained on data subject requests ✓

**Once ALL items checked, you are compliant to accept EU users.**

---

**Questions?** Review:
- `LEGAL_COMPLIANCE_STATUS.md` - Full compliance context
- `BREACH_RESPONSE_PLAN.md` - What to do if breach occurs
- `templates/legal/privacy.html` - Your privacy commitments

**Last Updated:** February 9, 2026
