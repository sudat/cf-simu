import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlanNameBadge } from '@/components/dialogs/amount-dialog/components/PlanNameBadge';

describe('PlanNameBadge', () => {
  it('デフォルトプランの場合は表示されない', () => {
    render(<PlanNameBadge planName="デフォルトプラン" isDefault={true} />);
    expect(screen.queryByText('デフォルトプラン')).not.toBeInTheDocument();
  });

  it('デフォルトプラン名でisDefaultがfalseでも表示されない', () => {
    render(<PlanNameBadge planName="デフォルトプラン" isDefault={false} />);
    expect(screen.queryByText('デフォルトプラン')).not.toBeInTheDocument();
  });

  it('非デフォルトプランの場合は表示される', () => {
    render(<PlanNameBadge planName="カスタムプラン" isDefault={false} />);
    expect(screen.getByText('カスタムプラン')).toBeInTheDocument();
  });

  it('正しいスタイルが適用される', () => {
    render(<PlanNameBadge planName="テストプラン" isDefault={false} />);
    const badge = screen.getByText('テストプラン');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('カスタムクラスが適用される', () => {
    render(<PlanNameBadge planName="テストプラン" isDefault={false} className="custom-class" />);
    const badge = screen.getByText('テストプラン');
    expect(badge).toHaveClass('custom-class');
  });

  it('最大幅が設定されている（長いプラン名の省略表示対応）', () => {
    render(<PlanNameBadge planName="非常に長いプラン名のテスト" isDefault={false} />);
    const badge = screen.getByText('非常に長いプラン名のテスト');
    expect(badge).toHaveClass('max-w-[120px]', 'text-ellipsis', 'overflow-hidden');
  });
});