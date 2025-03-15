import React, { useEffect } from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem, Select } from 'components/ui'
import CreatableSelect from 'react-select/creatable'
import { Field } from 'formik'
import { useSelector } from 'react-redux'

export const categories = [
	{ label: 'Bags', value: 'bags' },
	{ label: 'Cloths', value: 'cloths' },
	{ label: 'Devices', value: 'devices' },
	{ label: 'Shoes', value: 'shoes' },
	{ label: 'Watches', value: 'watches' }
]

export const tags = [
	{ label: 'trend', value: 'trend' },
	{ label: 'unisex', value: 'unisex' },
]

const OrganizationFields = props => {

	const { values, touched, errors } = props

	const subcategoryList = useSelector((state) => state.productForm.data.subcategoryList)
	const brandList = useSelector((state) => state.productForm.data.brandList)

	const subcategoryOptions = subcategoryList.map((subcategory) => {
		return {
			value: subcategory.id,
			label: subcategory.name
		}
	})

	const brandOptions = brandList.map((brand) => {
		return {
			value: brand.id,
			label: brand.name
		}
	})

	return (
		<AdaptableCard className="mb-4" divider isLastChild>
			<h5>Organización</h5>
			<p className="mb-6">Sección para configurar los atributos del producto</p>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="col-span-1">
					<FormItem
						label="Subcategoría"
						invalid={errors.subcategoryId && touched.subcategoryId}
						errorMessage={errors.subcategoryId}
					>
						<Field name="subcategoryId">
							{({ field, form }) => (
								<Select
									field={field}
									form={form}
									placeholder="Seleccione una subcategoría..."
									options={subcategoryOptions}
									value={subcategoryOptions.filter(category => category.value === values.subcategoryId)}
									onChange={option => form.setFieldValue(field.name, option.value)}
								/>
							)}
						</Field>
					</FormItem>
				</div>
				<div className="col-span-1">
					<FormItem
						label="Marca"
						invalid={errors.brandId && touched.brandId}
						errorMessage={errors.brandId}
					>
						<Field name="brandId">
							{({ field, form }) => (
								<Select
									field={field}
									form={form}
									placeholder="Seleccione una marca..."
									options={brandOptions}
									value={brandOptions.filter(category => category.value === values.brandId)}
									onChange={option => form.setFieldValue(field.name, option.value)}
								/>
							)}
						</Field>
					</FormItem>
				</div>
			</div>
		</AdaptableCard>
	)
}

export default OrganizationFields