import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  async handler({ auth, db }) {
    const identity = await auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Called `store` without authentication");

    const user = await db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", userId))
      .unique();

    if (!!user) {
      // already signed up, but check data and patch as required
      if (
        user.name !== identity.nickname ||
        user.profileImage !== identity.pictureUrl
      ) {
        // TODO: check when updated? Could be overridden? Maybe in a different col or table
        await db.patch(user._id, {
          name:
            identity.preferredUsername ??
            identity.nickname ??
            identity.givenName ??
            identity.name ??
            "User",
          profileImage: identity.pictureUrl,
        });
      }

      return user._id;
    }

    return await db.insert("users", {
      name:
        identity.preferredUsername ??
        identity.nickname ??
        identity.givenName ??
        identity.name ??
        "User",
      profileImage: identity.pictureUrl,
      clerkId: userId,
    });
  },
});

export const getUserForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler({ db }, { documentId }) {
    // get user info for a document regardless of if the authenticated user is... indeed authenticated
    const document = await db.get(documentId);
    if (!document) return;
    const user = await db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", document.userId))
      .unique();
    return user;
  },
});
