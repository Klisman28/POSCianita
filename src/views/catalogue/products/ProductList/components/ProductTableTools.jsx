import React from 'react'
import { Button } from 'components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const ProductTableTools = () => {

	return (
		<div className="flex flex-col md:flex-row md:justify-between lg:items-center">
			<Link
				className="block lg:inline-block mb-4 md:mb-0 lg:mx-2"
				to="/data/product-list.csv"
				target="_blank"
				download
			>
				<Button
					block
					size="sm"
					icon={<HiDownload />}
				>
					Exportar
				</Button>
			</Link>
			<Link 
            to="nuevo"
            className="block lg:inline-block mb-4 md:mb-0" >
				<Button
					block
					variant="solid"
					size="sm"
					icon={<HiPlusCircle />}
				>
					Nuevo Producto
				</Button>
			</Link>

		</div>
	)
}

export { ProductTableTools }