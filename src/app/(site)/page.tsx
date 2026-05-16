import { redirect } from "next/navigation";

export default function Home() {
  redirect("/recipes/cherry-cobbler");
}
