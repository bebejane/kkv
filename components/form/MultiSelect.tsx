import React from 'react';
import Select, { StylesConfig } from 'react-select';

export type MultiSelectOption = {
	value?: string;
	label?: string;
};
export type MultiSelectProps = {
	value: MultiSelectOption[];
	options: MultiSelectOption[];
	placeholder?: string;
	onChange: (value: MultiSelectOption[]) => void;
};

export default function MultiSelect({
	value,
	options = [],
	placeholder,
	onChange,
}: MultiSelectProps) {
	return (
		<Select
			defaultValue={[]}
			isMulti
			name='colors'
			options={options}
			styles={colourStyles}
			value={value}
			onChange={onChange}
			className='basic-multi-select'
			classNamePrefix='select'
			placeholder={placeholder}
		/>
	);
}

export interface ColourOption {
	readonly value: string;
	readonly label: string;
	readonly color: string;
	readonly isFixed?: boolean;
	readonly isDisabled?: boolean;
}

const colourStyles: StylesConfig<ColourOption, true> = {
	control: (styles) => ({
		...styles,
	}),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		return {
			...styles,

			color: 'var(--darkred)',
			backgroundColor: isFocused ? 'var(--graylight)' : 'white',
			':active': {
				...styles[':active'],
			},
			':hover': {
				...styles[':hover'],
				backgroundColor: 'var(--graylight)',
			},
		};
	},
	multiValue: (styles, { data }) => {
		return {
			...styles,
			color: 'var(--darkred)',
			backgroundColor: 'var(--graylight)',
		};
	},
	multiValueLabel: (styles, { data }) => ({
		...styles,
		color: data.color,
	}),
	multiValueRemove: (styles, { data }) => ({
		...styles,
		color: data.color,
		':hover': {
			backgroundColor: data.color,
		},
	}),
};
