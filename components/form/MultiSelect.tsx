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
		padding: 'var(--form-field-padding)',
	}),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			height: '2em',
			color: 'var(--black)',
			border: '0px solid var(--black)',
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
	valueContainer: (styles) => ({
		...styles,
		padding: '0',
	}),
	placeholder: (styles) => ({
		...styles,
	}),
	multiValue: (styles, { data }) => {
		return {
			...styles,
			color: 'var(--black)',
			border: '1px solid var(--black)',
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
	menu: (styles) => ({
		...styles,
		padding: 'var(--form-field-padding)',
	}),
	menuList: (styles) => ({
		...styles,
		border: '0px solid transparent !important',
	}),
};
