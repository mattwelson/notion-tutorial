import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { DataModel, Doc, Id } from "./_generated/dataModel";
import { Auth, GenericDatabaseReader, UserIdentity } from "convex/server";

async function userIsAuthenticated({ auth }: { auth: Auth }) {
  const identity = await auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated!");
  }
  const userId = identity.subject; // check correct user?
  return userId;
}

async function userOwnsDocument({
  userId,
  db,
  id,
}: {
  userId: string;
  db: GenericDatabaseReader<DataModel>;
  id: Id<"documents">;
}) {
  const document = await db.get(id);
  if (!document) throw new Error("Document not found");
  if (document.userId !== userId) throw new Error("Unauthorized");
  return document;
}

export const getById = query({
  args: {
    id: v.id("documents"),
  },
  async handler({ auth, db }, { id }) {
    const identity = await auth.getUserIdentity();
    const document = await db.get(id);

    if (!document) throw new Error("Not found");

    if (document.isPublished && !document.isArchived) return document;

    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    if (document.userId !== userId) throw new Error("Not authorized");

    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    return documents;
  },
});

export const getTrash = query({
  async handler({ auth, db }) {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;
    const documents = await db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();

    return documents;
  },
});

export const getSearch = query({
  async handler({ db, auth }) {
    const userId = await userIsAuthenticated({ auth });

    const documents = await db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated!");
    }
    const userId = identity.subject;
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return documentId;
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  async handler({ auth, db }, { id }) {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated!");
    }
    const userId = identity.subject; // check correct user?
    const document = await db.get(id);
    if (!document) throw new Error("Document not found");
    if (document.userId !== userId) throw new Error("Unauthorized");

    // archive all children
    async function archiveChildren(documentId: Id<"documents">) {
      const children = await db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await db.patch(child._id, {
          isArchived: true,
        });

        await archiveChildren(child._id);
      }
    }

    // archive self
    const documentId = await db.patch(id, {
      isArchived: true,
    });

    archiveChildren(id);

    return documentId;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  async handler({ auth, db }, { id }) {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated!");
    }
    const userId = identity.subject; // check correct user?
    const document = await db.get(id);
    if (!document) throw new Error("Document not found");
    if (document.userId !== userId) throw new Error("Unauthorized");

    // archive all children
    async function restoreChildren(documentId: Id<"documents">) {
      const children = await db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await db.patch(child._id, {
          isArchived: false,
        });

        await restoreChildren(child._id);
      }
    }

    // Orphan if parent is archived
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (document.parentDocument) {
      const parent = await db.get(document.parentDocument);
      if (parent?.isArchived) options.parentDocument = undefined;
    }

    restoreChildren(id);

    // archive self
    const documentId = await db.patch(id, options);

    return documentId;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler({ auth, db }, { id }) {
    const userId = await userIsAuthenticated({ auth });
    await userOwnsDocument({ userId, id, db });

    await db.delete(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  async handler({ auth, db }, { id, ...args }) {
    const userId = await userIsAuthenticated({ auth });
    await userOwnsDocument({ userId, db, id });

    await db.patch(id, args);
  },
});

export const removeIcon = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler({ auth, db }, { id, ...args }) {
    const userId = await userIsAuthenticated({ auth });
    await userOwnsDocument({ userId, db, id });

    await db.patch(id, {
      icon: undefined,
    });
  },
});

export const removeImage = mutation({
  args: {
    id: v.id("documents"),
  },
  async handler({ auth, db }, { id, ...args }) {
    const userId = await userIsAuthenticated({ auth });
    await userOwnsDocument({ userId, db, id });

    await db.patch(id, {
      coverImage: undefined,
    });
  },
});
