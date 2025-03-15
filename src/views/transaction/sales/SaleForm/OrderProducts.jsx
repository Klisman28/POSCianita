import React, { Fragment } from 'react'
import { AdaptableCard } from 'components/shared'
import { Table, Avatar, Button, Input } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'
import { HiMinusCircle, HiPlusCircle, HiTrash } from 'react-icons/hi'
import { Controller } from 'react-hook-form'
import { toast, Notification } from 'components/ui'

const { Tr, Th, Td, THead, TBody } = Table

const MainColumn = ({ row }) => {

	const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

	return (
		<div className="flex items-center">
			{avatar}
			<div className="ltr:ml-2 rtl:mr-2">
				<span className="text-black font-semibold">{row.name}</span>
				<div className="flex text-xs">
					<span className="capitalize">Marca: </span>
					<span className="font-semibold">
						{row.brand}
					</span>
				</div>
			</div>
		</div>
	)
}

const PriceAmount = ({ amount }) => {
	return (
		<NumericFormat
			displayType="text"
			value={(Math.round(amount * 100) / 100).toFixed(2)}
			prefix={'S/'}
			thousandSeparator={true}
		/>
	)
}

const OrderProducts = ({ errors, fields, remove, control, watch, handleChangeQuantity, setValue, getValues }) => {

	const handleOnKeyUp = (event, index) => {
		const stock = getValues(`products.${index}.stock`)
		const indexText = `products.${index}.quantity`
		const value = parseInt(event.target.value)

		if (!isNaN(value)) {
			if (value <= stock) {
				setValue(indexText, value)
			} else {
				setValue(indexText, stock)
				toast.push(
					<Notification title={"¡Stock Limitado!"} type="danger" duration={3000}>
						La cantidad máxima que puede agregar es {stock} 
					</Notification>
					, {
						placement: 'top-center'
					}
				)
			}


			const newQty = parseInt(getValues(indexText))
			const price = parseFloat(getValues(`products.${index}.price`))
			const subtotal = newQty * price
			setValue(`products.${index}.subtotal`, subtotal);
		}
	}

	return (
		<>
			<AdaptableCard className="mb-4">
				<Table>
					<THead className="!bg-transparent">
						<Tr>
							<Th>
								PRODUCTO
							</Th>
							<Th>
								COSTO
							</Th>
							<Th>
								CANTIDAD
							</Th>
							<Th>
								SUBTOTAL
							</Th>
							<Th></Th>
						</Tr>
					</THead>
					<TBody >
						<>
							{fields && fields.length > 0 ? fields.map((item, index) => {

								return (
									<Tr key={index}>
										<Td>
											<MainColumn row={item} />
										</Td>
										<Td>
											<PriceAmount amount={item.price} />
										</Td>
										<Td>
											<div className="flex items-center space-x-1 justify-center">
												<div
													className="text-red-400 cursor-pointer"
													onClick={() => handleChangeQuantity(index, false)}
												>
													<HiMinusCircle className='w-6 h-6' />
												</div>
												<Controller
													control={control}
													name={`products.${index}.quantity`}
													render={({ field: { onChange, value } }) => (
														<Input
															onChange={onChange}
															value={value}
															type="text"
															size="sm"
															suffix={item.unit}
															className="w-20"
															autoComplete="off"
															onKeyUp={(event) => handleOnKeyUp(event, index)}
														/>
													)}
												/>
												<div
													className="text-lime-500 cursor-pointer"
													onClick={() => handleChangeQuantity(index, true)}
												>
													<HiPlusCircle className='w-6 h-6' />
												</div>
											</div>
											{(errors.products && Array.isArray(errors.products)) &&
												< div className="text-red-500 text-xs text-left mt-1">
													{(errors.products[index]?.quantity?.type === 'typeError') ? 'Ingresar un numero' : errors.products[index]?.quantity?.message}
												</div>
											}
										</Td>
										<Td>
											<PriceAmount amount={watch(`products.${index}.subtotal`)} />
										</Td>
										<Td>
											<Button
												shape="circle"
												size="xs"
												className="text-red-600"
												icon={<HiTrash />}
												onClick={() => remove(index)}
											/>
										</Td>
									</Tr>
								)
							})
								:
								<Tr>
									<Td className="text-center" colSpan="5">
										{errors.products &&
											< div className="text-red-500 text-sm text-center mt-1">
												{errors.products.message}
											</div>
										}
									</Td>
								</Tr>
							}
						</>
					</TBody>
				</Table>
			</AdaptableCard>
		</>

	)
}

export default OrderProducts