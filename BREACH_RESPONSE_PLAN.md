# Data Breach Response Plan - Kerados

**Last Updated:** February 9, 2026

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
- **Technical Lead:** [Phone/Email - TO BE FILLED]
- **Legal Counsel:** [Phone/Email - TO BE FILLED]
- **Communications:** [Phone/Email - TO BE FILLED]

### External:
- **Supabase Support:** https://supabase.com/support
- **Render Support:** https://render.com/support
- **Legal Counsel:** [External attorney if applicable]

### Authorities:
- **EU DPA:** [Your lead supervisory authority - determine based on main establishment]
- **CA Attorney General:** https://oag.ca.gov/privacy/databreach/reporting
- **FTC:** https://www.ftc.gov (if applicable)

## 6. Post-Incident Review

Within 7 days:
- [ ] Root cause analysis
- [ ] Update security measures
- [ ] Document lessons learned
- [ ] Update response plan
- [ ] Conduct team debrief

## 7. Legal Requirements Summary

| Jurisdiction | Notification Timeframe | Authority Notification | User Notification |
|--------------|------------------------|------------------------|-------------------|
| **GDPR (EU)** | 72 hours | Required | Required if high risk |
| **CCPA (CA)** | Without unreasonable delay | Required if 500+ CA residents | Required |
| **General** | ASAP | Varies | Varies |

## 8. Pre-Incident Preparation Checklist

- [ ] Contact list filled in with current information
- [ ] Team trained on this procedure
- [ ] Email templates ready to customize
- [ ] Backup contact methods established
- [ ] Legal counsel identified and briefed
- [ ] Incident tracking system in place
- [ ] Regular security audits scheduled

## 9. Communication Templates

### Internal Alert Template:
```
SECURITY INCIDENT - IMMEDIATE ACTION REQUIRED

Incident ID: [ID]
Time Discovered: [UTC]
Severity: [Critical/High/Medium]

Brief Description:
[What happened]

Immediate Actions Taken:
[List]

Next Steps:
[List]

Response Team Meeting:
[Time/Location/Link]
```

### User Notification Template (Detailed):
```
Subject: Important Security Notice - Kerados

Dear [Name],

We are writing to inform you of a security incident that occurred on [Date].

WHAT HAPPENED:
[Clear, non-technical explanation]

WHAT INFORMATION WAS AFFECTED:
The following information may have been accessed:
- [List specific data types]

WHAT WE ARE DOING:
We have taken the following steps:
1. [Action]
2. [Action]
3. [Action]

WHAT YOU SHOULD DO:
We recommend you:
1. [Specific action]
2. [Specific action]
3. Monitor your accounts for suspicious activity

YOUR RIGHTS:
Under data protection laws, you have the right to:
- Request more information about the breach
- Request deletion of your data
- File a complaint with your data protection authority

CONTACT US:
If you have questions, contact us at:
- Email: security@kerados.com
- Response time: Within 48 hours

We sincerely apologize for this incident and are committed to protecting your information.

Sincerely,
[Name]
[Title]
Kerados
```

## 10. Severity Classification

### Critical (Notify within 24 hours):
- Exposure of passwords, financial data, or sensitive personal information
- Large-scale breach affecting 1000+ users
- Active ongoing breach

### High (Notify within 48 hours):
- Exposure of email addresses and names
- Breach affecting 100-1000 users
- Potential for identity theft

### Medium (Notify within 72 hours):
- Exposure of non-sensitive data
- Breach affecting <100 users
- Limited risk to individuals

## Notes for Implementation

1. **Test this plan annually** - Run a breach simulation
2. **Update contact information quarterly**
3. **Review legal requirements** when expanding to new jurisdictions
4. **Maintain insurance** - Consider cyber liability insurance (~$1-3K/year for startups)
5. **Document everything** - Detailed logs help with legal compliance and learning

---

**CRITICAL REMINDER:** The 72-hour GDPR clock starts from the moment you become AWARE of the breach, not when you confirm all details. Act quickly.
