import { Article } from "@/types/article";
import { User } from "@supabase/supabase-js";
import { Button, Chip, User as UserComponent } from "@heroui/react";
import { useRouter } from "next/navigation";
import { CardBody, Card, CardFooter } from "@heroui/react";
import { deleteArticle } from "@/services/articleService";
import DeleteButton from "./ui/DeleteButton";

interface BlogCardProps {
  blog: Article;
  session: User | null;
  onDelete: () => void;
}

export default function BlogCard({ blog, session, onDelete }: BlogCardProps) {
  const router = useRouter();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await deleteArticle(blog.id);
      onDelete();
    }
  };
  const handleClick = () => {
    router.push(`/articles/${blog.id}`);
  };
  return (
    <div className="max-w-[400px] cursor-pointer" onClick={handleClick}>
      <Card className="w-full">
        <CardBody>
          <UserComponent
            avatarProps={{
              src: "",
            }}
            description={blog.content}
            name={blog.title}
            className="user-component flex-1 flex justify-start"
          />
        </CardBody>
        <CardFooter className="flex gap-2 justify-between">
          <div className="flex gap-2">
            {blog.tags?.map((tag) => (
              <Chip color="secondary" key={tag} variant="solid" size="sm">
                {tag}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            {session?.id === blog.author.id && (
              <>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => router.push(`/articles/${blog.id}/edit`)}
                  className="px-2 py-0 min-w-5"
                >
                  编辑
                </Button>
                <DeleteButton
                  variant="light"
                  title="删除文章"
                  description="确定要删除这篇文章吗？"
                  onDelete={handleDelete}
                  className="px-2 py-0 min-w-5"
                />
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
