import React from 'react';

export function RectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-2-inside-1_2825_18515" fill="white">
        <rect x="4" y="6" width="16" height="12" rx="1" />
      </mask>
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="1"
        stroke="black"
        strokeWidth="3"
        mask="url(#path-2-inside-1_2825_18515)"
      />
    </svg>
  );
}

export function LineIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 17.5L18.5 5.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="6.25" stroke="black" strokeWidth="1.5" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.331 17.4196C6.0381 17.7125 6.0381 18.1874 6.331 18.4803C6.62389 18.7732 7.09876 18.7732 7.39166 18.4803L6.331 17.4196ZM19.6113 5.94995C19.6113 5.53574 19.2755 5.19995 18.8613 5.19995H12.1113C11.6971 5.19995 11.3613 5.53574 11.3613 5.94995C11.3613 6.36416 11.6971 6.69995 12.1113 6.69995H18.1113V12.7C18.1113 13.1142 18.4471 13.45 18.8613 13.45C19.2755 13.45 19.6113 13.1142 19.6113 12.7V5.94995ZM7.39166 18.4803L19.3917 6.48028L18.331 5.41962L6.331 17.4196L7.39166 18.4803Z"
        fill="black"
      />
    </svg>
  );
}
