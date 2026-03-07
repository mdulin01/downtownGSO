const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();
const db = admin.firestore();

// Define the Resend API key from Secret Manager
const resendApiKey = defineSecret("RESEND_API_KEY");

// Map post categories to interest categories for matching
const CATEGORY_TO_INTEREST = {
  "What I Love": ["Community Events", "Parks & Green Spaces"],
  "Opportunity": ["Community Events", "Shopping & Retail"],
  "Event": ["Community Events", "Live Music & Nightlife", "Arts & Culture"],
  "Business Spotlight": ["Dining & Restaurants", "Shopping & Retail", "Coffee & Cafes", "Bars & Breweries"],
};

// ===== WELCOME EMAIL =====
// Triggers when a new user document is created in Firestore
exports.onUserCreated = onDocumentCreated({ document: "users/{userId}", secrets: [resendApiKey] }, async (event) => {
  const userData = event.data.data();
  if (!userData?.email) return;

  // Only send welcome email to genuinely new users (no interests yet)
  if (userData.interests?.length > 0 || userData.profileCompleted) return;

  try {
    const resend = new Resend(resendApiKey.value());

    await resend.emails.send({
      from: "DowntownGSO <notifications@downtowngso.org>",
      to: userData.email,
      subject: "Welcome to DowntownGSO! 🌳",
      html: welcomeEmailHtml(userData.displayName || "Neighbor"),
    });

    console.log(`Welcome email sent to ${userData.email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
});

// ===== NEW POST NOTIFICATION =====
// Triggers when a new post is created
exports.onPostCreated = onDocumentCreated({ document: "posts/{postId}", secrets: [resendApiKey] }, async (event) => {
  const post = event.data.data();
  if (!post) return;

  const postId = event.params.postId;
  const category = post.category || "";

  try {
    const resend = new Resend(resendApiKey.value());

    // Find users whose interests match this post's category
    const matchingInterests = CATEGORY_TO_INTEREST[category] || [];

    // Query users with notifications enabled
    const usersSnapshot = await db
      .collection("users")
      .where("notificationsEnabled", "==", true)
      .get();

    const recipients = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      // Don't notify the author of their own post
      if (user.uid === post.authorId) return;
      if (!user.email) return;

      // Check if user has matching interests
      const userInterests = user.interests || [];
      const hasMatch =
        matchingInterests.length === 0 ||
        userInterests.some((interest) => matchingInterests.includes(interest));

      if (hasMatch) {
        recipients.push(user.email);
      }
    });

    if (recipients.length === 0) {
      console.log("No matching recipients for post notification");
      return;
    }

    // Send emails in batches (Resend supports batch sending)
    // For free tier, send individually to stay under limits
    const emailPromises = recipients.slice(0, 50).map((email) =>
      resend.emails.send({
        from: "DowntownGSO <notifications@downtowngso.org>",
        to: email,
        subject: `New in Downtown GSO: ${post.title}`,
        html: postNotificationHtml(post, postId),
      })
    );

    await Promise.allSettled(emailPromises);
    console.log(`Post notification sent to ${recipients.length} users`);
  } catch (error) {
    console.error("Error sending post notifications:", error);
  }
});

// ===== EMAIL TEMPLATES =====

function welcomeEmailHtml(name) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:28px;margin:0;">
        Downtown<span style="color:#34d399;">GSO</span>
      </h1>
    </div>
    <div style="background:#1e293b;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,0.05);">
      <h2 style="color:#fff;font-size:22px;margin:0 0 12px;">Hey ${name}! 👋</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Welcome to DowntownGSO — your community hub for everything happening in downtown Greensboro.
      </p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Here's what you can do:
      </p>
      <ul style="color:#94a3b8;font-size:15px;line-height:1.8;padding-left:20px;margin:0 0 24px;">
        <li><strong style="color:#fff;">Share</strong> what you love about downtown</li>
        <li><strong style="color:#fff;">Discover</strong> local businesses and events</li>
        <li><strong style="color:#fff;">Suggest</strong> ideas to make downtown even better</li>
        <li><strong style="color:#fff;">Connect</strong> with your neighbors</li>
      </ul>
      <div style="text-align:center;margin:28px 0 8px;">
        <a href="https://downtowngso.org" style="display:inline-block;background:#10b981;color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
          Complete Your Profile →
        </a>
      </div>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;">
      You're receiving this because you signed up for DowntownGSO.<br>
      <a href="https://downtowngso.org/profile/me" style="color:#64748b;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>`;
}

function postNotificationHtml(post, postId) {
  const authorName = post.authorName || "Someone";
  const title = post.title || "New post";
  const description = (post.description || "").substring(0, 200);
  const category = post.category || "";
  const location = typeof post.location === "string" ? post.location : post.location?.address || "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:28px;margin:0;">
        Downtown<span style="color:#34d399;">GSO</span>
      </h1>
    </div>
    <div style="background:#1e293b;border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,0.05);">
      <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">
        ${authorName} shared something new${category ? ` in <strong style="color:#34d399;">${category}</strong>` : ""}
      </p>
      <h2 style="color:#fff;font-size:20px;margin:0 0 12px;">${title}</h2>
      ${description ? `<p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">${description}${description.length >= 200 ? "..." : ""}</p>` : ""}
      ${location ? `<p style="color:#64748b;font-size:13px;margin:0 0 20px;">📍 ${location}</p>` : ""}
      <div style="text-align:center;margin:24px 0 8px;">
        <a href="https://downtowngso.org/forum" style="display:inline-block;background:#10b981;color:#fff;padding:12px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
          View Post →
        </a>
      </div>
    </div>
    <p style="color:#475569;font-size:12px;text-align:center;margin-top:24px;">
      You're receiving this based on your interests on DowntownGSO.<br>
      <a href="https://downtowngso.org/profile/me" style="color:#64748b;">Manage notification preferences</a>
    </p>
  </div>
</body>
</html>`;
}
