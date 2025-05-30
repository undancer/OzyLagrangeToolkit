import { SvgIcon, SvgIconProps } from "@mui/material";

export function BattleShipIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 300 300">
            <path
                d="M248.299,175.75c-0.235-6-2.08-12.132-5.125-17H290v-16h-75.667h-15.515c-1.113-9.746-9.4-17-19.439-17H157v-59
		c0-4.418-3.582-8-8-8s-8,3.582-8,8v59h-41v17H50v33H248.299z"
            />
            <path
                d="M0,191.75v27c0,12.15,10.35,22,22.5,22h244.662c8.87,0,16.514-5.082,19.995-12.643c0.568-1.233,6.211-18.357,12.343-36.357
		H0z"
            />
        </SvgIcon>
    );
}
