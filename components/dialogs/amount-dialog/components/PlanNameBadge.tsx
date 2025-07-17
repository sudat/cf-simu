import { Badge } from "@/components/ui/badge";

interface PlanNameBadgeProps {
  planName: string;
  isDefault?: boolean;
  className?: string;
}

export function PlanNameBadge({ 
  planName, 
  isDefault = false, 
  className = "" 
}: PlanNameBadgeProps) {
  // デバッグログ
  if (process.env.NODE_ENV === 'development') {
    console.log('[PlanNameBadge] 表示判定:', {
      planName,
      isDefault,
      isDefaultPlanName: planName === "デフォルトプラン",
      shouldHide: isDefault || planName === "デフォルトプラン",
      willRender: !(isDefault || planName === "デフォルトプラン")
    });
  }
  
  // デフォルトプランの場合は表示しない
  if (isDefault || planName === "デフォルトプラン") {
    return null;
  }

  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-100 text-blue-800 hover:bg-blue-200 text-ellipsis overflow-hidden max-w-[120px] ${className}`}
    >
      {planName}
    </Badge>
  );
}