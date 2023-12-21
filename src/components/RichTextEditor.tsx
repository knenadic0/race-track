import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(import('react-quill'), {
	ssr: false,
});
import 'react-quill/dist/quill.snow.css';
import { StyleProp } from '@datatypes/StyleProps';
import classNames from 'classnames';

const RichTextEditor = ({ className }: StyleProp) => {
	const [value, setValue] = useState('');

	return <ReactQuill theme="snow" value={value} onChange={setValue} className={classNames(className)} />;
};

export default RichTextEditor;
