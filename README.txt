HACKNOPACK WEBSITE CLONE
========================

Pages included: Home, About, Products, six product detail pages, Contact, Request a Quote.
Built from the supplied AIRO MHT captures; original page copy, layouts and captured images are retained.

FORMS — FORMSUBMIT
==================
Both forms are connected to the FormSubmit email-link token supplied by the site owner.

Endpoint used by both forms:
https://formsubmit.co/fusupo

Contact form subject: New HACKNOPACK Contact Enquiry
Quote form subject: New HACKNOPACK Quotation Request

The forms use normal HTML POST submission. FormSubmit handles delivery; no EmailJS account, API key, SMTP settings, PHP or Node.js backend is required. The first submission may trigger an email activation/confirmation request. Complete that confirmation in the receiving mailbox before expecting ongoing delivery.

The URL supplied by the owner was https://formsubmit.co/el/fusupo. The /el/fusupo address is the hosted email-link page; the corresponding POST form endpoint uses the same token without the /el/ path: https://formsubmit.co/fusupo.

LOCAL PREVIEW
=============
Open index.html in a browser. For best results use a local web server (for example VS Code Live Server). FormSubmit requires a web-served page for reliable operation; test submissions from your deployed domain.

GO DADDY / CPANEL DEPLOYMENT
============================
Upload the contents of this folder into public_html (or your chosen document root). Keep the folder structure intact.

FORM TESTING
============
1. Deploy the site to your domain or test using a local web server.
2. Submit one Contact enquiry and one Quote request.
3. Check the destination inbox and spam folder.
4. If FormSubmit sends an activation/confirmation email, click its confirmation link.
5. Submit again to verify delivery.

NOTES
=====
- The contact and quote forms retain their original visible fields and design.
- Each form has its own email subject for easier inbox filtering.
- A hidden honeypot field is included for basic spam-bot filtering. FormSubmit may apply its own anti-spam checks/CAPTCHA.
- Email delivery has not been live-tested from the public domain in this build environment.
