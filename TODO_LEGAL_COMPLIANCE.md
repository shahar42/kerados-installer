# Legal Compliance TODO - Kerados

**Created:** February 9, 2026
**Status:** Privacy Policy complete, 5 critical items remaining before launch

---

## ✅ COMPLETED

- [x] **Privacy Policy** - GDPR/CCPA compliant, published at `/legal/privacy`
- [x] **Security hardening** - Rate limiting, XSS protection, SQL injection prevention
- [x] **Compliance tracker** - Full documentation in `LEGAL_COMPLIANCE_STATUS.md`

---

## ⚠️ CRITICAL - DO BEFORE PUBLIC LAUNCH

### 1. Add Consent Checkbox to Waitlist Form
**Priority:** CRITICAL
**Time:** 30 minutes
**Risk:** GDPR fines up to €20M, CCPA up to $7,500/violation

**Files to modify:**
- `templates/index.html` - Add checkbox and notice text
- `static/js/waitlist-modal.js` - Update form submission
- `app.py` - Update endpoint to store consent
- `supabase_schema.sql` - Add consent columns

**Implementation:**

#### Step 1: Update Database Schema
Run in Supabase SQL Editor:
```sql
ALTER TABLE waitlist ADD COLUMN consent_marketing BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE waitlist ADD COLUMN consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE waitlist ADD COLUMN consent_ip VARCHAR(45);
ALTER TABLE waitlist ADD COLUMN ccpa_opt_out BOOLEAN DEFAULT FALSE;
```

#### Step 2: Update Waitlist Modal HTML
In `templates/index.html`, find the waitlist form and add BEFORE the submit button:

```html
<!-- Notice at Collection -->
<div class="form-notice">
    <p><strong>Privacy Notice:</strong> We collect your name and email to notify you when Kerados launches. We will not sell your information. See our <a href="/legal/privacy" target="_blank">Privacy Policy</a> for details.</p>
</div>

<!-- Consent Checkboxes -->
<div class="form-group">
    <label class="checkbox-label">
        <input type="checkbox" id="consent-required" name="consent_required" required aria-required="true">
        <span>I consent to Kerados storing my information for waitlist notifications. I can withdraw consent at any time by emailing privacy@kerados.com. <strong>(Required)</strong></span>
    </label>
</div>

<div class="form-group">
    <label class="checkbox-label">
        <input type="checkbox" id="consent-marketing" name="consent_marketing">
        <span>I consent to receiving product updates and marketing emails. <em>(Optional)</em></span>
    </label>
</div>
```

#### Step 3: Update CSS
Add to `static/css/styles.css`:

```css
.form-notice {
    background: rgba(79, 70, 229, 0.1);
    border-left: 3px solid #4f46e5;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 0.9em;
}

.form-notice a {
    color: #4f46e5;
    text-decoration: underline;
}

.checkbox-label {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    cursor: pointer;
    font-size: 0.9em;
    line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
    margin-top: 4px;
    cursor: pointer;
    width: 18px;
    height: 18px;
}
```

#### Step 4: Update JavaScript
In `static/js/waitlist-modal.js`, update `handleSubmit`:

```javascript
// Around line 70, update formData collection:
const formData = {
    first_name: form.elements['first_name'].value.trim(),
    last_name: form.elements['last_name'].value.trim(),
    email: form.elements['email'].value.trim(),
    reason: form.elements['reason'].value.trim(),
    consent_required: form.elements['consent_required'].checked,
    consent_marketing: form.elements['consent_marketing'].checked
};
```

#### Step 5: Update Backend
In `app.py`, update the `/api/waitlist` endpoint (around line 100):

```python
# Add after extracting form data:
consent_required: bool = data.get('consent_required', False)
consent_marketing: bool = data.get('consent_marketing', False)

# Validate consent
if not consent_required:
    return {"error": "You must consent to data collection to join the waitlist"}, 400

# Get user IP for GDPR record
user_ip: str = request.remote_addr or request.environ.get('HTTP_X_FORWARDED_FOR', '')

# Update the INSERT query:
query = text("""
    INSERT INTO waitlist (first_name, last_name, email, reason,
                         consent_marketing, consent_ip)
    VALUES (:first_name, :last_name, :email, :reason,
            :consent_marketing, :consent_ip)
""")

conn.execute(query, {
    'first_name': first_name,
    'last_name': last_name,
    'email': email,
    'reason': reason,
    'consent_marketing': consent_marketing,
    'consent_ip': user_ip
})
```

---

### 2. Add CCPA "Do Not Sell" Link
**Priority:** HIGH
**Time:** 5 minutes
**Risk:** CCPA violations up to $7,500 per incident

**Files to modify:**
- `templates/index.html`

**Implementation:**

In `templates/index.html`, find the footer legal links section (around line 199) and add:

```html
<div class="footer-section">
    <h4>Legal</h4>
    <a href="/legal/terms">Terms of Service</a>
    <a href="/legal/privacy">Privacy Policy</a>
    <a href="/legal/accessibility">Accessibility</a>
    <a href="/legal/impressum">Impressum</a>
    <a href="/legal/ccpa-opt-out"><strong>Do Not Sell My Personal Information</strong></a> <!-- ADD THIS -->
</div>
```

Create new file `templates/legal/ccpa-opt-out.html`:

```html
{% extends "legal/base_legal.html" %}

{% block title %}CCPA Opt-Out - Kerados{% endblock %}

{% block content %}
<h1>Do Not Sell or Share My Personal Information</h1>

<div class="section">
    <h2>Your CCPA Rights</h2>
    <p>California residents have the right to opt out of the "sale" or "sharing" of personal information as defined by the California Consumer Privacy Act (CCPA/CPRA).</p>

    <p><strong>Important:</strong> Kerados does NOT sell or share your personal information. We do not:</p>
    <ul>
        <li>❌ Sell your data to third parties</li>
        <li>❌ Share your data for cross-context behavioral advertising</li>
        <li>❌ Use your data for profiling or automated decision-making</li>
    </ul>
</div>

<div class="section">
    <h2>How We Use Your Data</h2>
    <p>We only share your information with service providers (Supabase for database hosting, Render for web hosting) who are contractually obligated to protect your data and use it only for providing services to us.</p>
</div>

<div class="section">
    <h2>To Exercise Your Rights</h2>
    <p>If you would like to:</p>
    <ul>
        <li>Request deletion of your data</li>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Opt out of future communications</li>
    </ul>

    <p><strong>Email us at:</strong> <a href="mailto:privacy@kerados.com">privacy@kerados.com</a></p>
    <p>We will respond within 45 days as required by CCPA.</p>
</div>

<div class="section">
    <h2>Contact Information</h2>
    <p>California Privacy Protection Agency: <a href="https://cppa.ca.gov">cppa.ca.gov</a></p>
</div>
{% endblock %}
```

Add route to `app.py`:

```python
@app.route('/legal/ccpa-opt-out')
def ccpa_opt_out() -> str:
    """CCPA opt-out page"""
    return render_template('legal/ccpa-opt-out.html')
```

---

### 3. Sign Supabase DPA (Data Processing Agreement)
**Priority:** CRITICAL
**Time:** 5 minutes
**Risk:** GDPR fines up to €20M for processing without DPA

**Steps:**
1. Log into Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Data Protection** (or **Legal**)
4. Review and sign the Data Processing Agreement (DPA)
5. Download a copy for your records
6. Save to `/legal_documents/Supabase_DPA_[date].pdf`

**Note:** This MUST be done before processing any EU user data. GDPR Article 28 requires written DPAs with all data processors.

---

### 4. Create Terms of Service
**Priority:** HIGH
**Time:** 15 minutes
**Risk:** Legal liability, unclear user agreements

**File to create:**
- `templates/legal/terms.html`

**Template:**

```html
{% extends "legal/base_legal.html" %}

{% block title %}Terms of Service - Kerados{% endblock %}

{% block content %}
<h1>Terms of Service</h1>
<p><strong>Last Updated:</strong> February 9, 2026</p>

<div class="section">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using Kerados ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
</div>

<div class="section">
    <h2>2. Waitlist Terms</h2>
    <p>Joining the waitlist does not guarantee:</p>
    <ul>
        <li>Access to the product</li>
        <li>Specific launch timeline</li>
        <li>Pricing or features</li>
    </ul>
    <p>We reserve the right to modify or cancel the waitlist at any time.</p>
</div>

<div class="section">
    <h2>3. Intellectual Property</h2>
    <p>All content, trademarks, and intellectual property on this website are owned by Kerados. You may not copy, reproduce, or distribute without permission.</p>
</div>

<div class="section">
    <h2>4. User Conduct</h2>
    <p>You agree not to:</p>
    <ul>
        <li>Use the Service for illegal purposes</li>
        <li>Attempt to hack, reverse engineer, or disrupt the Service</li>
        <li>Submit false or misleading information</li>
        <li>Spam or abuse the waitlist system</li>
    </ul>
</div>

<div class="section">
    <h2>5. Disclaimer of Warranties</h2>
    <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.</p>
</div>

<div class="section">
    <h2>6. Limitation of Liability</h2>
    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, KERADOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.</p>
</div>

<div class="section">
    <h2>7. Indemnification</h2>
    <p>You agree to indemnify and hold Kerados harmless from any claims, damages, or expenses arising from your violation of these Terms or misuse of the Service.</p>
</div>

<div class="section">
    <h2>8. Termination</h2>
    <p>We reserve the right to terminate or suspend your access to the Service at any time without notice for violating these Terms.</p>
</div>

<div class="section">
    <h2>9. Governing Law</h2>
    <p>These Terms are governed by the laws of [Your State/Country]. Any disputes shall be resolved in the courts of [Your Jurisdiction].</p>
</div>

<div class="section">
    <h2>10. Changes to Terms</h2>
    <p>We may update these Terms at any time. Continued use after changes constitutes acceptance of updated Terms.</p>
</div>

<div class="section">
    <h2>11. Contact</h2>
    <p>For questions about these Terms: <a href="mailto:legal@kerados.com">legal@kerados.com</a></p>
</div>

<p><em>Last updated: February 9, 2026</em></p>
{% endblock %}
```

**Customize:**
- Replace `[Your State/Country]` with your location
- Replace `[Your Jurisdiction]` with applicable courts
- Set up `legal@kerados.com` email

---

### 5. Create Breach Response Plan
**Priority:** HIGH
**Time:** 20 minutes
**Risk:** Late notifications = €10M or 2% revenue (GDPR)

**File to create:**
- `BREACH_RESPONSE_PLAN.md`

**Template:**

```markdown
# Data Breach Response Plan - Kerados

## 1. Detection & Containment (Hour 0-2)

### Immediate Actions:
- [ ] Stop the breach (revoke credentials, block IPs, take service offline)
- [ ] Preserve evidence (logs, screenshots, system state)
- [ ] Assemble response team (technical lead, legal, communications)
- [ ] Start incident log with timestamps

### Technical Team:
- Identify breach scope (what data accessed/exfiltrated)
- Determine attack vector
- Assess systems affected
- Implement immediate security patches

## 2. Assessment (Hour 2-24)

### Data Impact Analysis:
- [ ] Number of users affected
- [ ] Types of data compromised (names, emails, passwords, etc.)
- [ ] Severity assessment (low/medium/high risk to individuals)

### Geographic Analysis:
- [ ] EU users affected? (GDPR 72-hour clock starts)
- [ ] California users? (CCPA notification required)
- [ ] Other jurisdictions?

## 3. Notification Requirements

### GDPR (72 hours from discovery):
**Authority:** Contact relevant EU Data Protection Authority
- **Email:** [Find authority at https://edpb.europa.eu/about-edpb/about-edpb/members_en]
- **Required info:** Nature of breach, data affected, likely consequences, mitigation measures

### CCPA (Without unreasonable delay):
**Affected Users:** Direct email notification
**Authority:** California Attorney General (if 500+ CA residents affected)

### Template Notification:
```
Subject: Security Incident Notification - Kerados

Dear [User],

We are writing to inform you of a security incident that may have affected your personal information.

What Happened:
[Brief description]

What Information Was Involved:
[Specific data types]

What We're Doing:
[Mitigation steps]

What You Can Do:
[Recommended actions]

Contact:
security@kerados.com

Sincerely,
Kerados Security Team
```

## 4. Incident Log Format

```
Incident ID: [YYYY-MM-DD-###]
Discovery Date/Time: [UTC]
Breach Type: [Unauthorized access / Data leak / etc.]
Affected Systems: [List]
Data Types Affected: [List]
User Count: [Number]
Geographic Scope: [Regions]

Timeline:
- [Time] [Event]
- [Time] [Action taken]

Notifications Sent:
- [Time] Data Protection Authority notified
- [Time] Users notified (X users)

Resolution:
- [Time] Breach contained
- [Time] Systems restored
- [Time] Incident closed
```

## 5. Contact List

### Internal:
- **Technical Lead:** [Phone/Email]
- **Legal Counsel:** [Phone/Email]
- **Communications:** [Phone/Email]

### External:
- **Supabase Support:** https://supabase.com/support
- **Render Support:** https://render.com/support
- **Legal Counsel:** [External attorney if applicable]

### Authorities:
- **EU DPA:** [Your lead supervisory authority]
- **CA Attorney General:** oag.ca.gov/privacy/databreach/reporting
- **FTC:** ftc.gov (if applicable)

## 6. Post-Incident Review

Within 7 days:
- [ ] Root cause analysis
- [ ] Update security measures
- [ ] Document lessons learned
- [ ] Update response plan
- [ ] Conduct team debrief
```

---

## 📋 VERIFICATION CHECKLIST

Before marking items complete, verify:

**Item 1 (Consent Checkbox):**
- [ ] Checkbox displays correctly
- [ ] Required checkbox cannot be bypassed
- [ ] Database stores consent values
- [ ] API validates consent is true
- [ ] Test submission with/without consent

**Item 2 (CCPA Link):**
- [ ] Link visible in footer
- [ ] Page renders correctly
- [ ] Email address works

**Item 3 (Supabase DPA):**
- [ ] DPA signed in dashboard
- [ ] Copy downloaded and saved
- [ ] Date recorded

**Item 4 (Terms of Service):**
- [ ] Customized with your jurisdiction
- [ ] Legal email set up
- [ ] Linked from footer

**Item 5 (Breach Plan):**
- [ ] Contact list filled in
- [ ] Team trained on procedure
- [ ] Templates ready to use

---

## 🚀 DEPLOYMENT STEPS

After completing above:

1. Test locally:
```bash
python app.py
# Visit http://localhost:5000
# Test waitlist signup with/without consent
```

2. Commit changes:
```bash
git add .
git commit -m "Add legal compliance: consent tracking, CCPA opt-out, Terms"
git push
```

3. Update Supabase:
- Run schema updates in SQL Editor
- Verify columns added

4. Deploy to Render:
- Deployment auto-triggers on push
- Monitor logs for errors

5. Final verification:
```bash
python view_waitlist.py
# Should see consent columns
```

---

## 📞 NEXT SESSION PRIORITIES

1. Complete items 1-5 above
2. Set up email addresses (privacy@, legal@, support@)
3. Add physical address for CCPA/CAN-SPAM compliance
4. Test full waitlist flow end-to-end
5. Consider: Insurance for data breaches (~$1-3K/year)

---

**IMPORTANT:** Do NOT launch publicly until items 1-3 are complete. Risk of legal action is too high.

**Questions?** Review `LEGAL_COMPLIANCE_STATUS.md` for full context.
