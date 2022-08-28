-- CreateTable
CREATE TABLE "_comments_likes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_comments_dislikes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_comments_likes_AB_unique" ON "_comments_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_comments_likes_B_index" ON "_comments_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_comments_dislikes_AB_unique" ON "_comments_dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_comments_dislikes_B_index" ON "_comments_dislikes"("B");

-- AddForeignKey
ALTER TABLE "_comments_likes" ADD CONSTRAINT "_comments_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comments_likes" ADD CONSTRAINT "_comments_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comments_dislikes" ADD CONSTRAINT "_comments_dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_comments_dislikes" ADD CONSTRAINT "_comments_dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
