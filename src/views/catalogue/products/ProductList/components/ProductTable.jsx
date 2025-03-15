import React, { useEffect, useMemo } from 'react'
import { Avatar, Badge } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedProduct } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import {ProductTableTools} from './ProductTableTools'
import { useNavigate } from 'react-router-dom'

const inventoryStatusColor = {
	0: { label: 'En Stock', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500'},
	1: { label: 'Limitado', dotClass: 'bg-amber-500', textClass: 'text-amber-500' },
	2: { label: 'Agotado', dotClass: 'bg-red-500', textClass: 'text-red-500' },
}

const ActionColumn = ({row}) => {
	
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		navigate(`${row.id}/edit`)
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedProduct(row))
	}
	
	return (
		<div className="flex justify-end text-lg">
			<span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit}>
				<HiOutlinePencil />
			</span>
			<span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
				<HiOutlineTrash />
			</span>
		</div>
	)
}

const CategoryColumn = ({row}) => {
	
	const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{avatar}
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.name}
			</span>
		</div>
	)
}

const ProductTable = () => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.products.data.tableData)
	const loading = useSelector((state) => state.products.data.loading)
	const data = useSelector((state) => state.products.data.productList)

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() => 
		({initialPageIndex, initialPageSize, total}), 
	[initialPageIndex, initialPageSize, total])

	const fetchData = () => {
		dispatch(getProducts())
	}

	const columns = useMemo(() => [
		{
			Header: 'Producto',
			accessor: 'name',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <CategoryColumn row={row} />
			},
		},
		{
			Header: 'SKU',
			accessor: 'sku',
			sortable: true,
		},
		{
			Header: 'Marca',
			accessor: 'brand.name',
			sortable: true,
		},
		{
			Header: 'Subcategoría',
			accessor: 'subcategory.name',
			sortable: true,
		},
		{
			Header: 'Cost',
			accessor: 'cost',
			sortable: true,
			Cell: props => {
				const { cost } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> S/ </span> {cost}
					</div>
				)
			}
		},
		{
			Header: 'Utility',
			accessor: 'utility',
			sortable: true,
			Cell: props => {
				const { utility } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> S/ </span> {utility}
					</div>
				)
			}
		},
		{
			Header: 'Price',
			accessor: 'price',
			sortable: true,
			Cell: props => {
				const { price } = props.row.original
				return (
					<div className='flex items-center'>
						<span className='text-xs'> S/ </span> {price}
					</div>
				)
			}
		},
		{
			Header: 'Stock',
			accessor: 'stock',
			sortable: true,
			Cell: props => {
				const { stock, unit } = props.row.original
				return (
					<div className='flex items-center'>
						{stock} <span className='text-xs ml-1'> {unit.symbol} </span> 
					</div>
				)
			}
		},
		{
			Header: 'Status',
			accessor: 'status',
			sortable: true,
			Cell: props => {
				const { status } = props.row.original
				return (
					<div className="flex items-center gap-2">
						<Badge className={inventoryStatusColor[status]?.dotClass} />
						<span className={`capitalize font-semibold ${inventoryStatusColor[status]?.textClass}`}>
							{inventoryStatusColor[status]?.label}
						</span>
					</div>
				)
			},
		},
		{
			Header: 'Acciones',
			id: 'action',
			accessor: (row) => row,
			Cell: props => <ActionColumn row={props.row.original} />
		}
	], [])

	return (
		<>
			<DataTableSimple 
				columns={columns} 
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{className: 'rounded-md'}}
				loading={loading}
				pagingData={tableData}
				tableTools={<ProductTableTools />}
				title="Productos"
			/>
			<ProductDeleteConfirmation />
		</>
	)
}

export default ProductTable