import toast, { Renderable, ValueOrFunction } from 'react-hot-toast';

type ToastProps = {
	success: ValueOrFunction<Renderable, unknown>;
	error: ValueOrFunction<Renderable, unknown>;
	loading: Renderable;
};

export const toastPromise = (promise: Promise<unknown>, props: ToastProps) =>
	toast.promise(promise, props, {
		success: {
			duration: 4000,
		},
		error: {
			duration: 4000,
		},
	});
