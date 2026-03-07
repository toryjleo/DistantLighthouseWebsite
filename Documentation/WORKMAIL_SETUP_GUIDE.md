# Setting Up AWS WorkMail for distantlighthouse.com

This guide walks you through setting up `tory@distantlighthouse.com` using AWS WorkMail. It assumes you already have an AWS account and your domain (`distantlighthouse.com`) registered in Route 53.

---

## Step 1: Choose Your Region

WorkMail is only available in a few regions. Go to the [AWS WorkMail Console](https://console.aws.amazon.com/workmail/) and select one of:

- **US East (N. Virginia)** — `us-east-1` ← recommended
- US West (Oregon) — `us-west-2`
- Europe (Ireland) — `eu-west-1`

Pick whichever region is closest to you, or matches where the rest of your AWS stuff lives.

---

## Step 2: Create an Organization

1. In the WorkMail console, click **"Create organization"**
2. Choose **"Existing Route 53 domain"** — it should auto-detect `distantlighthouse.com`
3. Give your organization an **alias** (e.g., `distantlighthouse`) — this creates a fallback `distantlighthouse.awsapps.com` domain, but you'll use your real domain
4. Leave the default settings (new directory, no existing AD integration)
5. Click **Create**

This takes a few minutes to provision.

---

## Step 3: Verify Domain & DNS Records

Once the organization is created:

1. Go to **Organization settings → Domains**
2. Select `distantlighthouse.com`
3. WorkMail will show you DNS records that need to be added. **Because you're on Route 53, there should be an "Update in Route 53" button** that auto-adds most of them. Use it!

The records it will set up:

| Record | Type | Purpose |
|---|---|---|
| MX record | MX | Points `distantlighthouse.com` mail to WorkMail's servers |
| SPF | TXT | Authorizes AWS to send email on your behalf |
| DKIM | CNAME (×3) | Three CNAME records for email signing/authentication |
| DMARC | TXT | Policy for handling emails that fail authentication |
| Autodiscover | CNAME | Helps email clients auto-configure themselves |

> ⚠️ **If you already have an MX record** (e.g., from a parking page or previous email provider), it needs to be **replaced**, not added alongside. There should only be one set of MX records. The Route 53 auto-setup should handle this, but double-check.

> ℹ️ DNS propagation can take a few minutes to a few hours. WorkMail will show verification status — just wait for the green checkmarks.

---

## Step 4: Create Your User

1. Go to **Users** in the WorkMail console
2. Click **"Create user"**
3. Fill in:
   - **Username:** `tory`
   - **Display name:** Your name as you want it to appear
   - **Email:** This will automatically be `tory@distantlighthouse.com`
   - **Password:** Set a strong password
4. Click **Create**

That's it — `tory@distantlighthouse.com` now exists!

---

## Step 5: Test It

1. Go to `https://mail.awsapps.com/mail` (or your org alias URL)
2. Log in with the username and password you just created
3. Send yourself a test email from a personal account (Gmail, etc.)
4. Send a test email **to** your personal account from WorkMail
5. Check that both directions work

> 💡 After confirming it works, check your test email's headers in Gmail. Look for `SPF: PASS`, `DKIM: PASS`, and `DMARC: PASS`. If all three pass, your DNS is set up correctly and your emails won't end up in spam.

---

## Step 6: Set Up Your Preferred Email Client

You don't have to use the WorkMail web UI — you can connect any email client (Apple Mail, Outlook, Thunderbird, etc.).

### Apple Mail (macOS / iOS)
1. **System Settings → Internet Accounts → Add Account → Other**
2. Choose **"Add Mail Account"**
3. Enter your name, `tory@distantlighthouse.com`, and your password
4. If it doesn't auto-discover, use manual settings:

| Setting | Value |
|---|---|
| **Incoming (IMAP)** | |
| Server | `imap.mail.us-east-1.awsapps.com` |
| Port | `993` |
| SSL | Yes |
| Username | `tory@distantlighthouse.com` |
| **Outgoing (SMTP)** | |
| Server | `smtp.mail.us-east-1.awsapps.com` |
| Port | `465` |
| SSL | Yes |
| Username | `tory@distantlighthouse.com` |

> ℹ️ Replace `us-east-1` in the server addresses with whatever region you chose in Step 1.

### Thunderbird
Thunderbird usually auto-discovers settings. Just enter your email and password and it should figure it out thanks to the Autodiscover CNAME record from Step 3.

### Outlook
Add as a regular IMAP account with the same settings listed above.

---

## Step 7 (Optional but Recommended): Tighten DMARC Policy

The auto-generated DMARC record starts in monitoring mode (`p=none`). After confirming everything works for a week or two, update the DMARC TXT record in Route 53 to:

```
v=DMARC1; p=quarantine; rua=mailto:tory@distantlighthouse.com
```

This tells receiving servers to quarantine (spam-folder) emails that fail authentication, protecting against people spoofing your domain.

---

## That's It!

The whole process should take about 15–30 minutes of actual work, plus some waiting for DNS propagation. The hardest part is waiting for the green checkmarks. 🚀
