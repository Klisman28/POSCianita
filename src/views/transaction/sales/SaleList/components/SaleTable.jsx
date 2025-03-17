import React, { useEffect, useMemo } from 'react'
import { Badge } from 'components/ui'
import { DataTableSimple } from 'components/shared'
import { HiOutlineEye, HiOutlineTrash, HiOutlinePrinter,HiOutlineReply  } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { getSalesOpening, getSales} from '../store/dataSlice'
import { toggleDeleteConfirmation, setSelectedSale, setShowDialogOpen } from '../store/stateSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import SaleDeleteConfirmation from './SaleDeleteConfirmation'
import { SaleTableTools } from './SaleTableTools'
import SaleShowDialog from './SaleShowDialog'
import { useNavigate } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { apiReturnSale } from 'services/transaction/SaleService'


const inventoryTypeColor = {
	'Ticket': { label: 'Ticket', dotClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
	'Boleta': { label: 'Boleta', dotClass: 'bg-amber-500', textClass: 'text-amber-500' },
	'Factura': { label: 'Factura', dotClass: 'bg-blue-500', textClass: 'text-blue-500' },
}

const ActionColumn = ({ row }) => {

	const navigate = useNavigate()

	const dispatch = useDispatch()
	const { textTheme } = useThemeClass()

	const onEdit = () => {
		dispatch(setSelectedSale(row))
		dispatch(setShowDialogOpen(true))
	}

	const onDelete = () => {
		dispatch(toggleDeleteConfirmation(true))
		dispatch(setSelectedSale(row))
	}

	const onPrint = () => {
		navigate(`/transacciones/ventas/${row.id}/imprimir`)
	}

  const onReturn = async () => {
    try {
      // Llamada al backend para devolver la venta
      await apiReturnSale(row.id)
      // Opcional: refrescar listado de ventas
      dispatch(getSales())
      // Opcional: mostrar una notificación de éxito
      console.log('Devolución realizada con éxito')
    } catch (error) {
      // Manejo de error, por ejemplo, mostrar un mensaje en pantalla
      console.error('Error al devolver la venta', error)
    }
  }

	return (
		<div className="flex justify-end text-lg">
			<span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit}>
				<HiOutlineEye />
			</span>
			<span className="cursor-pointer p-2 hover:text-blue-500" onClick={onPrint}>
				<HiOutlinePrinter />
			</span>
			<span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
				<HiOutlineTrash />
			</span>
			<span
    className={`cursor-pointer p-2 hover:text-green-500 ${
        row.status === 2 ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    onClick={row.status === 2 ? undefined : onReturn}
    title={row.status === 2 ? 'La venta ya ha sido devuelta' : 'Devolver venta'}
>
    <HiOutlineReply />
</span>
		</div>
	)
}

const MainColumn = ({ row }) => {

	return (
		<div className="flex items-center">
			<span className={`ml-2 rtl:mr-2 font-semibold`}>
				{row.dateIssue}
			</span>
		</div>
	)
}

const ClientColumn = ({ row }) => {
	return (
	  <div className="flex items-center">
		{row.type !== 'Ticket' ? (
		  row.type === 'Boleta' ? (
			<span>
			  {row.customer?.fullname || 'CF'}
			</span>
		  ) : (
			<span>
			  {row.enterprise?.name || 'CF'}
			</span>
		  )
		) : (
		  <span>N/A</span>
		)}
	  </div>
	);
  }
  

const CurrencyColumn = ({ value }) => {

	return (
		<NumericFormat
			displayType="text"
			value={(Math.round(value * 100) / 100).toFixed(2)}
			prefix={'Q '}
			thousandSeparator={true}
		/>
	)
}

const SaleTable = ({ openingId }) => {

	const dispatch = useDispatch()
	const { initialPageIndex, initialPageSize, total } = useSelector((state) => state.saleList.data.tableData)
	const loading = useSelector((state) => state.saleList.data.loading)
	const data = useSelector((state) => state.saleList.data.saleList)

	useEffect(() => {
		if (openingId !== undefined) {
			fetchOpeningSales()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialPageSize, initialPageSize])

	const tableData = useMemo(() =>
		({ initialPageIndex, initialPageSize, total }),
		[initialPageIndex, initialPageSize, total])

	const fetchOpeningSales = () => {
		dispatch(getSalesOpening(openingId))
	}

	const columns = useMemo(() => [
		{
			Header: 'Fecha',
			accessor: 'dataIssue',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return <MainColumn row={row} />
			},
		},
		{
			Header: 'Total',
			accessor: 'total',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<CurrencyColumn value={row.total} />
				)
			}
		},
		{
			Header: 'SAT',
			accessor: 'igv',
			sortable: true,
			Cell: props => {
				const row = props.row.original
				return (
					<CurrencyColumn value={row.igv} />
				)
			}
		},
		{
			Header: 'Cliente',
			accessor: 'saleableId',
			sortable: false,
			Cell: props => {
				const row = props.row.original
				return <ClientColumn row={row} />
			}
		},
		{
			Header: 'Tipo',
			accessor: 'type',
			sortable: true,
			Cell: props => {
				const { type } = props.row.original
				return (
					<div className="flex items-center gap-2">
						<Badge className={inventoryTypeColor[type].dotClass} />
						<span className={`capitalize font-semibold ${inventoryTypeColor[type].textClass}`}>
							{inventoryTypeColor[type].label}
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
				skeletonAvatarProps={{ className: 'rounded-md' }}
				loading={loading}
				pagingData={tableData}
				tableTools={<SaleTableTools />}
				title="Mis Ventas"
			/>
			<SaleDeleteConfirmation />
			<SaleShowDialog />
		</>
	)
}

export default SaleTable