import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { StyleProp } from '@datatypes/StyleProps';
import classNames from 'classnames';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ className }: StyleProp) => {
	const [value, setValue] = useState('');
	const ReactQuill = useMemo(() => {
		return dynamic(() => import('react-quill'), {
			loading: () => <p>loading...</p>,
			ssr: false,
		});
	}, []);

	return <ReactQuill theme="snow" value={value} onChange={setValue} className={classNames(className)} />;
};

export default RichTextEditor;
