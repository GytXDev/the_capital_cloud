// components/icons/icon.tsx
import React from 'react';

const IconCapitalCloud = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={30}
      height={30}
      className="w-5 inline-block transition-transform group-hover:rotate-[20deg]"
      viewBox="0 0 500 500"
      fill="currentColor"
      {...props}
    >
      <g transform="matrix(0.992 0 0 0.992 254.51357870496275 250)">
        <image
          style={{
            stroke: 'none',
            strokeWidth: 0,
            fill: 'rgb(0,0,0)',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          xlinkHref="/logo.svg" 
          x="-250"
          y="-250"
          width="500"
          height="500"
        />
      </g>
    </svg>
  );
};

export default IconCapitalCloud;
