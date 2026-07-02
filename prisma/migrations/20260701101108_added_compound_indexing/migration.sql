-- DropIndex
DROP INDEX "Comment_post_idx";

-- DropIndex
DROP INDEX "Post_author_idx";

-- CreateIndex
CREATE INDEX "Comment_post_isDeleted_idx" ON "Comment"("post", "isDeleted");

-- CreateIndex
CREATE INDEX "Post_author_published_isDeleted_idx" ON "Post"("author", "published", "isDeleted");
