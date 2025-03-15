import React from 'react'
import { AdaptableCard } from 'components/shared'
import { Input, FormItem, Select } from 'components/ui'
import { Field } from 'formik'
import { NumberFormatBase } from 'react-number-format'
import { useSelector } from 'react-redux'

export const categories = [
    { label: 'Bags', value: 'bags' },
    { label: 'Cloths', value: 'cloths' },
    { label: 'Devices', value: 'devices' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Watches', value: 'watches' }
]

const NumberInput = props => {
    return <Input {...props} value={props.field.value} />
}

const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
        <NumberFormatBase
            customInput={Input}
            type="text"
            onValueChange={onValueChange}
            autoComplete="off"
            {...rest}
        />
    )
}

const BasicInfoFields = props => {

    const { values, touched, errors } = props

    const unitList = useSelector((state) => state.productForm.data.unitList)

    const unitOptions = unitList.map((unit) => {
        return {
            value: unit.id,
            label: `${unit.name} (${unit.symbol})`
        }
    })


    return (
        <AdaptableCard className="mb-4" divider>
            <h5>Información Básica</h5>
            <p className="mb-6">Sección para configurar la información básica del producto</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <FormItem
                        label="Nombre Producto"
                        invalid={errors.name && touched.name}
                        errorMessage={errors.name}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="name"
                            placeholder="nombre de producto"
                            component={Input}
                        />
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Código"
                        invalid={errors.sku && touched.sku}
                        errorMessage={errors.sku}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="sku"
                            placeholder="P001-M01-S01-C01"
                            component={Input}
                        />
                    </FormItem>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Stock"
                        invalid={errors.stock && touched.stock}
                        errorMessage={errors.stock}
                    >
                        <Field name="stock">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Stock"
                                        customInput={NumberInput}
                                        onValueChange={e => {
                                            form.setFieldValue(field.name, e.value)
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Stock Mínimo"
                        invalid={errors.stockMin && touched.stockMin}
                        errorMessage={errors.stockMin}
                    >
                        <Field name="stockMin">
                            {({ field, form }) => {
                                return (
                                    <NumberFormatInput
                                        form={form}
                                        field={field}
                                        placeholder="Stock"
                                        customInput={NumberInput}
                                        onValueChange={e => {
                                            form.setFieldValue(field.name, e.value)
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Unidad"
                        invalid={errors.unitId && touched.unitId}
                        errorMessage={errors.unitId}
                    >
                        <Field name="unitId">
                            {({ field, form }) => (
                                <Select
                                    field={field}
                                    form={form}
                                    placeholder="Seleccione una unidad..."
                                    options={unitOptions}
                                    value={unitOptions.filter(category => category.value === values.unitId)}
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

export default BasicInfoFields