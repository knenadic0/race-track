import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PropsWithStyle } from '@datatypes/StyleProps';
import 'react-quill/dist/quill.snow.css';

export type RichTextProps = {
	value?: string;
	onChange: (value: string) => void;
};

const RichTextEditor = ({ value, className, onChange }: PropsWithStyle<RichTextProps>) => {
	const ReactQuill = useMemo(() => {
		return dynamic(() => import('react-quill'), {
			loading: () => <p>loading editor...</p>,
			ssr: false,
		});
	}, []);

	return <ReactQuill theme="snow" value={value} className={className} onChange={onChange} />;
};

export default RichTextEditor;
