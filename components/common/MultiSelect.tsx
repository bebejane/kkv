import React from 'react';
import Select from 'react-select';

export type MultiSelectOption = {
	value?: string;
	label?: string;
};
export type MultiSelectProps = {
	value: MultiSelectOption[];
	options: MultiSelectOption[];
	onChange: (value: MultiSelectOption[]) => void;
};

export default function MultiSelect({ value, options = [], onChange }: MultiSelectProps) {
	return (
		<Select
			defaultValue={[]}
			isMulti
			name='colors'
			options={options}
			value={value}
			onChange={onChange}
			className='basic-multi-select'
			classNamePrefix='select'
		/>
	);
}
