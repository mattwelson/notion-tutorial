import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  users: defineTable({
    name: v.string(),
    profileImage: v.optional(v.string()),
    clerkId: v.string(),
  }).index("by_clerk", ["clerkId"]),

  tasks: defineTable({
    title: v.string(),
    userId: v.string(),
    document: v.optional(v.id("documents")),
  })
    .index("by_user", ["userId"])
    .index("by_user_document", ["userId", "document"]),
});
