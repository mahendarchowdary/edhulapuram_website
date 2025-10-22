import { NewsTicker } from "./news-ticker";
import { getNewsItems } from "@/lib/supabase/queries";

export async function NewsTickerServer() {
  const news = await getNewsItems();
  return <NewsTicker news={news} />;
}
