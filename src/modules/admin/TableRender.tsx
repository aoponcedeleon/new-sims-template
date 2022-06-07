import React, { useState, useEffect } from 'react';
import {
	createStyles,
	Table,
	ScrollArea,
	Group,
	Text,
	Pagination,
	Skeleton,
	NativeSelect,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
	th: {
		padding: '0 !important',
	},

	td: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},

	control: {
		width: '100%',
		padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

		'&:hover': {
			backgroundColor:
				theme.colorScheme === 'dark'
					? theme.colors.dark[6]
					: theme.colors.gray[0],
		},
	},

	icon: {
		width: 21,
		height: 21,
		borderRadius: 21,
	},
}));

interface Props {
	data: Array<Object>;
	idColumn: string;
	ignoreColumn?: string;
	columnHeadings?: Array<string>;
	filterableHeadings?: Array<string>;
}

// const filterData = (data: Array<Object>, filterQuery: string) => {
// 	const keys = Object.keys(data[0]);
// 	const query = filterQuery.toLowerCase().trim();
// 	return data.filter((item: any) =>
// 		keys.some(
// 			(key: any) =>
// 				typeof item[key] === 'string' &&
// 				item[key].toLowerCase().includes(query),
// 		),
// 	);
// };

const TableRender = ({
	data,
	idColumn,
	ignoreColumn,
	columnHeadings,
	filterableHeadings,
}: Props) => {
	const { classes } = useStyles();
	const [loading, setLoading] = useState<boolean>(true);
	const [activePage, setPage] = useState<number>(1);
	const [currentLimit, setCurrentLimit] = useState<number>(10);
	const [dataRendered, setDataRendered] = useState(data.slice(0, 9));

	const columnStrings: string[] = columnHeadings
		? columnHeadings
		: Object.keys(data[0]);
	const columns = columnStrings.map((heading) => <th>{heading}</th>);

	const rows = dataRendered.map((row: any) => {
		const unique = row[idColumn];
		return (
			<tr key={unique}>
				{Object.keys(row).map((rowdata) => {
					return <td>{row[rowdata].length >= 100 ? '' : row[rowdata]}</td>;
				})}
			</tr>
		);
	});

	const filters = filterableHeadings ? (
		filterableHeadings.map((filter) => {
			const arrayValues: string[] = ['All'];
			data.forEach((el: any) => {
				if (arrayValues.includes(el[filter]) !== true) {
					arrayValues.push(el[filter]);
					console.log('Pushed');
				}
			});

			console.log(arrayValues);
			return (
				<NativeSelect
					data={arrayValues}
					onChange={(event) => {
						// if (event.currentTarget.value !== 'All') {
						// 	changeFilter(event.currentTarget.value);
						// } else reloadData(1);
					}}
					placeholder={filter}
					label={`Filter ${filter}`}
				/>
			);
		})
	) : (
		<></>
	);

	useEffect(() => {
		setTimeout(function () {
			setLoading(false);
		}, 300);
	}, []);

	const reloadData = (page: number) => {
		setLoading(true);
		const lowerBound = page * currentLimit - currentLimit;
		const upperBound = page * currentLimit - 1;
		setDataRendered(data.slice(lowerBound, upperBound));
		setLoading(false);
	};

	// const changeFilter = (query: string) => {
	// 	setLoading(true);
	// 	setDataRendered(filterData(data, query).slice(0, 9));
	// 	setLoading(false);
	// };

	return (
		<>
			<Skeleton visible={loading}>
				<Group>
					<></>
					{filterableHeadings ? <Group> {filters} </Group> : <></>}
				</Group>
				<ScrollArea sx={{ height: 'auto' }}>
					<Table
						fontSize={12}
						horizontalSpacing="md"
						verticalSpacing="xs"
						striped
						highlightOnHover
						sx={{ tableLayout: 'auto', minWidth: 700 }}
					>
						<thead>
							<tr>{columns}</tr>
						</thead>
						<tbody>
							{rows.length > 0 ? (
								rows
							) : (
								<tr>
									<td colSpan={9}>
										<Text weight={500} align="center">
											Nothing found
										</Text>
									</td>
								</tr>
							)}
						</tbody>
					</Table>
				</ScrollArea>
			</Skeleton>
			<Group>
				<Text>
					{/* <Group>
						Showing 1 to {currentLimit} of {data.length} rows{' '}
						<NativeSelect
							data={['10', '25', '50']}
							value={currentLimit}
							placeholder={currentLimit.toString()}
							onChange={(event) => {
								setCurrentLimit(Number(event.currentTarget.value));
								console.log(event);
								console.log(currentLimit);
								setPage(1);
								reloadData(1);
							}}
						/>
						rows per page
					</Group> */}
				</Text>
				<Pagination
					my="sm"
					page={activePage}
					onChange={(page) => {
						reloadData(page);
						setPage(page);
					}}
					total={Math.floor(data.length / 10)}
				/>
			</Group>
		</>
	);
};

export default TableRender;
