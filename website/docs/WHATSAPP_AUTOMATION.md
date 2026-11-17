# WhatsApp automation (AiSensy): setup for the owner

The website can send two WhatsApp messages by itself. Nothing is sent until
you finish the steps below. Each message WhatsApp delivers is charged by
AiSensy / WhatsApp at their normal rate.

| Message | When it goes | Who gets it |
|---|---|---|
| Payment received | Right after a successful payment | The buyer |
| Mock today | 8 am on a Rank Challenge mock day | Everyone who has the mocks |

## Step 1. Create two templates in AiSensy
AiSensy → Manage → Template Message → New. Category **Utility**, language
**English** (Hindi lines are inside the text). Submit and wait for WhatsApp to
approve (usually a few hours to 2 days).

**Template 1, name `payment_received`**
```
Namaste {{1}}, your payment for {{2}} is received. Thank you!

Start here: https://www.ukpscdecoded.in/test-platform
Log in with the same email you used to buy.

नमस्ते, आपका भुगतान मिल गया है। ऊपर दिए लिंक से लॉगिन करके शुरू करें।
Need help? Reply to this message.
```
`{{1}}` = student's name, `{{2}}` = course name.

**Template 2, name `mock_today`**
```
Namaste {{1}}, {{2}} is today.

Start any time between 12 noon and 6 pm. Ranks and solutions come at 8 pm.
Open: https://www.ukpscdecoded.in/mahasangram

आज आपका मॉक है। दोपहर 12 से शाम 6 बजे के बीच शुरू करें। रैंक रात 8 बजे।
```
`{{1}}` = student's name, `{{2}}` = mock name.

## Step 2. Create two API campaigns in AiSensy
AiSensy → Campaigns → Launch → **API Campaign**. Make one campaign per
template and note the campaign names exactly (for example `payment_received`
and `mock_today`). Set each campaign to Live.

## Step 3. Add three values in Vercel
Vercel → the ukpscdecoded project → Settings → Environment Variables
(Production). Type them there yourself; never paste the key into a chat.

| Name | Value |
|---|---|
| `AISENSY_API_KEY` | AiSensy → Manage → API Key |
| `AISENSY_CAMPAIGN_PAYMENT` | the campaign name for template 1 |
| `AISENSY_CAMPAIGN_MOCK_DAY` | the campaign name for template 2 |

Then Vercel → Deployments → the latest one → Redeploy.
To switch one message off later, delete its `AISENSY_CAMPAIGN_…` value and redeploy.

## Step 4. Test
Buy the cheapest product with a test coupon on your own number. You should
get the payment message within a minute. If not, Vercel → Logs → search
`[whatsapp]` shows the reason AiSensy gave.

## Keyword auto-replies (no code, do this in AiSensy today)
AiSensy → Live Chat → Settings → Auto reply / Keyword reply. Suggested replies:

| If the message has | Reply |
|---|---|
| price, fees, कीमत, फीस | Rank Challenge (6 live mocks) ₹499. Revision Test Series (22 tests) ₹999. Complete Prelims Pack ₹3,299. All prices till 29 Nov: https://www.ukpscdecoded.in/revision |
| which, kaun sa, कौन सा | Only mocks with rank: Rank Challenge. Full last-month revision: Revision Test Series. Videos + all tests: Complete Prelims Pack. Compare here: https://www.ukpscdecoded.in/courses |
| hindi, हिंदी | हाँ, सभी टेस्ट हिंदी और अंग्रेज़ी दोनों में हैं। वेबसाइट पर ऊपर "हिंदी" बटन दबाएं। |
| login, otp, code, लॉगिन | Open https://www.ukpscdecoded.in/student/login, type your email and press Send code. The 6-digit code comes to your email (check Spam too). |
| validity, kab tak, वैधता | Revision Test Series and Rank Challenge stay open till 15 January 2027. |
| refund, रिफंड | Refund policy: https://www.ukpscdecoded.in/refund-policy |
| mock time, timing, समय | Mock days: start any time from 12 noon to 6 pm. Rank list and solutions at 8 pm. Dates: https://www.ukpscdecoded.in/mahasangram |
| book, किताब | Uttarakhand Decoded, English and Hindi editions, ₹499 with free delivery: https://www.ukpscdecoded.in/buy-book |
| answer key, उत्तर कुंजी | Our answer key and score calculator come on exam evening, 29 Nov: https://www.ukpscdecoded.in/answer-key |

Check each price against the website before saving the replies.

## Login with a code on WhatsApp (optional, built 17 Nov)

Students can log in with their mobile number and a 6-digit code on WhatsApp
instead of email. It stays off until you do these three steps. Do them
outside a mock window, and test with your own number first.

1. In AiSensy, create a template with category **Authentication**, name
   `login_code`. Choose the "Copy code" button. WhatsApp writes the text
   itself ("123456 is your verification code."). Submit and wait for approval.
2. Create an **API campaign** on that template, name it `login_code`, set it Live.
3. In Vercel > Settings > Environment Variables add
   `AISENSY_CAMPAIGN_OTP` = `login_code` (the API key from Step 3 above must
   already be there), then Redeploy.

After that the login page shows "WhatsApp" first and "Email" second.
- A student who already has an account must type the mobile number saved on
  that account; otherwise the site offers to make a new account. If that
  happens they should use the Email tab.
- To switch it off again, delete `AISENSY_CAMPAIGN_OTP` in Vercel and redeploy.
- Each code is a paid WhatsApp authentication message (a small charge per
  message, see your AiSensy wallet).
- This has not been tested against a real AiSensy account. If codes do not
  arrive, check AiSensy > Campaigns > API campaign logs for the reason.

## Not built yet
- Login with a WhatsApp code instead of email (planned after 25 Nov).
- Reminder for an unfinished checkout, and the 8 pm "your rank is out" message
  (Vercel's free plan has no spare scheduled job).
