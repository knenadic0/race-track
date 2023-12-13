export type StyleProp = {
	className?: string;
};

export type PropsWithStyle<T> = StyleProp & T;
