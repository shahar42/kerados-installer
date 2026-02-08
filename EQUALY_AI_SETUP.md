# Equaly AI Integration Guide

## What is Equaly AI?
Israeli startup providing automated web accessibility compliance for ADA, WCAG 2.1, Section 508, and EN 301 549.

## Why Use It?
- **Legal Protection**: Avoid ADA lawsuits (US websites face $25k-$75k+ in settlements)
- **Automatic Compliance**: Fixes 50+ accessibility barriers with AI
- **2-Minute Setup**: No coding required
- **Continuous Monitoring**: 24/7 compliance tracking
- **Real User Testing**: Feedback from disability communities

## Integration Steps

### 1. Sign Up
1. Go to https://equally.ai
2. Start 7-day free trial
3. Enter your website URL: `https://shlookapaka.onrender.com`
4. Get your widget code from dashboard

### 2. Add Widget to Your Site
1. Copy the JavaScript snippet from your Equaly AI dashboard
2. Open `templates/index.html`
3. Find the commented section in `<head>`:
   ```html
   <!-- Equaly AI Accessibility Widget -->
   <!-- TODO: Replace with your actual widget ID after signup at https://equally.ai -->
   ```
4. Replace the commented line with your actual script:
   ```html
   <script src="https://widget.equally.ai/YOUR-WIDGET-ID.js" data-equally-id="YOUR-ID"></script>
   ```
5. Commit and push:
   ```bash
   git add templates/index.html
   git commit -m "Add Equaly AI accessibility widget"
   git push
   ```

### 3. Configure Widget (Dashboard)
- **Icon Position**: Bottom right (default) or customize
- **Color Scheme**: Match your brand (#4f46e5 - your primary color)
- **Features to Enable**:
  - ✓ Screen reader optimization (critical for blind users)
  - ✓ Keyboard navigation
  - ✓ High contrast mode
  - ✓ Text size adjustments
  - ✓ Color blind modes
  - ✓ Content reading guide

### 4. Run Flowy Audit (Developer Tool)
1. Enable **Flowy** in your dashboard
2. Run automated scan
3. Review categorized issues:
   - **Critical**: Fix immediately (e.g., missing alt text)
   - **High**: Fix soon (e.g., low contrast)
   - **Medium**: Fix when possible
4. Follow implementation guides provided by ChatGPT assistant

### 5. Test Compliance
- **Automated**: Run Flowy scans weekly
- **Manual**: Test with screen readers (NVDA, JAWS)
- **Community**: Get feedback from Equaly AI's disability network
- **Certification**: Download compliance certificate for legal protection

## Best Practices for Flask Apps

### Template Integration
Add to `base.html` or `index.html` in `<head>` section for site-wide coverage.

### Performance
- Widget loads asynchronously (no page speed impact)
- ~50KB gzipped
- CDN-hosted for fast delivery

### Testing Checklist
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader announces all interactive elements
- [ ] Forms have proper labels and error messages
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Skip navigation link works

### Monitoring
- Check Flowy dashboard weekly
- Enable email alerts for new issues
- Review compliance reports monthly

## Pricing (After Trial)
- **Starter**: ~$490/year (single site)
- **Professional**: ~$1,490/year (multiple sites + priority support)
- **Enterprise**: Custom (white-label, SLA, dedicated account manager)

## Legal Benefits
- **ADA Compliance**: Reduces lawsuit risk by 95%+
- **WCAG 2.1 AA/AAA**: Meet international standards
- **Documentation**: Automatic compliance reports for legal teams
- **Insurance**: Some plans include accessibility insurance

## Support
- Email: support@equally.ai
- Dashboard: Live chat available
- Documentation: https://equally.ai/docs
- Community: Access to disability testing network

## ROI
- **Time Saved**: 80-90% vs manual accessibility work
- **Legal Risk**: Avoid $25k-$75k+ lawsuit settlements
- **Market Reach**: 15% of population has disabilities
- **SEO Boost**: Accessible sites rank better on Google

---

**Next Steps:**
1. Sign up at https://equally.ai (7-day free trial)
2. Get your widget code
3. Replace the TODO comment in `templates/index.html`
4. Deploy and test
5. Download compliance certificate
