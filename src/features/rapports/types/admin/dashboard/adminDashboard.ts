export interface StatCardProps {
    title: string;
    value: string | number | undefined;
    sub: string;
    color: string;
    isLate?: boolean;
    isRefreshing?: boolean;
}

export interface AdminActionBannerProps {
    onActionClick: () => void;
    isDisabled: boolean;
}