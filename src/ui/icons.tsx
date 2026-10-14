import type { ReactNode } from 'react';

const S = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const IconDrawer = () => <S><rect x="3" y="2.5" width="14" height="15" rx="1.5" /><path d="M3 7.5h14M3 12.5h14M8.5 5h3M8.5 10h3M8.5 15h3" /></S>;
export const IconShelf = () => <S><rect x="3" y="2.5" width="14" height="15" rx="1.5" /><path d="M3 7.5h14M3 12.5h14" /></S>;
export const IconDoor = () => <S><rect x="4" y="2.5" width="12" height="15" rx="1.5" /><circle cx="6.8" cy="6" r="1" /><circle cx="6.8" cy="14" r="1" /></S>;
export const IconGas = () => <S><path d="M4 16 15 5M3 17l2-2M14 4l3-1-1 3" /><path d="M7 13l4-4" strokeWidth={3} /></S>;
export const IconRaster = () => <S><path d="M5 3v14M15 3v14" /><circle cx="5" cy="6" r=".9" fill="currentColor" /><circle cx="5" cy="10" r=".9" fill="currentColor" /><circle cx="5" cy="14" r=".9" fill="currentColor" /><circle cx="15" cy="6" r=".9" fill="currentColor" /><circle cx="15" cy="10" r=".9" fill="currentColor" /><circle cx="15" cy="14" r=".9" fill="currentColor" /></S>;
export const IconGear = () => <S size={18}><circle cx="10" cy="10" r="2.6" /><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" /></S>;
export const IconSun = () => <S size={18}><circle cx="10" cy="10" r="3.5" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" /></S>;
export const IconMoon = () => <S size={18}><path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5z" /></S>;
export const IconBack = () => <S><path d="M12.5 4 6.5 10l6 6" /></S>;
export const IconChevron = () => <S size={16}><path d="m8 5 5 5-5 5" /></S>;
export const IconLogo = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <path d="M3 17 13 7M11 5l4 4M14 2l4 4-2 2-4-4z" /><path d="M3 17l2-5 3 3z" fill="currentColor" />
  </svg>
);
export const IconSliders = () => <S size={18}><path d="M3 6h9M15 6h2M3 14h2M8 14h9" /><circle cx="13.5" cy="6" r="1.8" /><circle cx="6.5" cy="14" r="1.8" /></S>;
export const IconDownload = () => <S size={17}><path d="M10 3v10M6 9l4 4 4-4M4 16h12" /></S>;
