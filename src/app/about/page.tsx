export const revalidate = 0;
import { AboutClient } from "./AboutClient";
import { getAboutAssets, getAboutBasicInfo, getAboutFinancials, getAboutInfrastructure, getAboutSanitation, getAboutVillages } from "@/lib/supabase/queries";

export default async function AboutPage() {
  const [basicInfo, villages, infrastructure, sanitation, financials, assets] = await Promise.all([
    getAboutBasicInfo(),
    getAboutVillages(),
    getAboutInfrastructure(),
    getAboutSanitation(),
    getAboutFinancials(),
    getAboutAssets(),
  ]);

  return (
    <AboutClient
      basicInfo={basicInfo.map((b) => ({
        label: b.label,
        value_numeric: b.value_numeric,
        value_text: b.value_text,
        icon: b.icon,
        position: b.position,
      }))}
      villages={villages}
      infrastructure={infrastructure}
      sanitation={sanitation}
      financials={financials}
      assets={assets}
    />
  );
}
