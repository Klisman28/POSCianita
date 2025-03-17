import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem } from 'components/ui'
import { NumericFormat } from 'react-number-format'
import { Field } from 'formik'

const CurrencyInput = props => {
	return <Input {...props} value={props.field.value} prefix="Q" />
}

// const TaxRateInput = props => {
// 	return <Input {...props} value={props.field.value} />
// }

const NumberFormatInput = ({ onValueChange, ...rest }) => {
	return (
		<NumericFormat
			customInput={Input}
			type="text"
			onValueChange={onValueChange}
			autoComplete="off"
			{...rest}
		/>
	)
}

const PricingFields = props => {

	const { touched, errors } = props

	const calculatePrice = (form, value, field) => {

		// const cost = field === 'cost' ? parseFloat(value) : 0
		// const utility = field === 'utility' ? parseFloat(value) : 0  

		if (field === 'cost') {
			const cost = parseFloat(value)
			const utility = parseFloat(form.values.utility)
			if (!isNaN(cost) && !isNaN(utility)) {
				form.setFieldValue('price', cost + utility)
			}
		} else {
			const utility = parseFloat(value)
			const cost = parseFloat(form.values.cost)
			if (!isNaN(cost) && !isNaN(utility)) {
				form.setFieldValue('price', cost + utility)
			}
		}
		// const cost = parseFloat(form.values.cost)
		// const utility = parseFloat(form.values.utility)

		// if (!isNaN(cost) && !isNaN(utility)) {
		// 	console.log('entre!!');
		// 	form.setFieldValue('price', cost + utility)

		// }else {
		// 	console.log('nooo!!');
		// 	form.setFieldValue('price', '')
		// }
	}

	return (
		<AdaptableCard className="mb-4" divider>
			<h5>Información de valor</h5>
			<p className="mb-6">Sección para configurar la información de compra, venta y ganacia del producto</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="col-span-1">
					<FormItem
						label="Costo"
						invalid={errors.cost && touched.cost}
						errorMessage={errors.cost}
					>
						<Field name="cost">
							{({ field, form }) => {
								return (
									<NumberFormatInput
										form={form}
										field={field}
										placeholder="0.00"
										customInput={CurrencyInput}
										onValueChange={e => {
											form.setFieldValue(field.name, e.value)
											calculatePrice(form, e.value, 'cost')
										}}
									/>
								)
							}}
						</Field>
					</FormItem>
				</div>
				<div className="col-span-1">
					<FormItem
						label="Utilidad"
						invalid={errors.utility && touched.utility}
						errorMessage={errors.utility}
					>
						<Field name="utility">
							{({ field, form }) => {
								return (
									<NumberFormatInput
										form={form}
										field={field}
										placeholder="0.00"
										customInput={CurrencyInput}
										onValueChange={e => {
											form.setFieldValue(field.name, e.value)
											calculatePrice(form, e.value, 'utility')
										}}
									/>
								)
							}}
						</Field>
					</FormItem>
				</div>
				<div className="col-span-1">
					<FormItem
						label="Precio"
						invalid={errors.price && touched.price}
						errorMessage={errors.price}
					>
						<Field name="price">
							{({ field, form }) => {
								return (
									<NumberFormatInput
										form={form}
										field={field}
										disabled
										placeholder="0.00"
										customInput={CurrencyInput}
										onValueChange={e => {
											form.setFieldValue(field.name, e.value)
										}}
									/>
								)
							}}
						</Field>
					</FormItem>
				</div>
			</div>
		</AdaptableCard>
	)
}

export default PricingFields