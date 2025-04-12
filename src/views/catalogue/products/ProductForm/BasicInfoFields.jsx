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

const NumberInput = (props) => {
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

const BasicInfoFields = (props) => {

    const { values, touched, errors } = props

    const unitList = useSelector((state) => state.productForm.data.unitList)

    const unitOptions = unitList.map((unit) => ({
        value: unit.id,
        label: `${unit.name} (${unit.symbol})`
    }))

    return (
        <AdaptableCard className="mb-4" divider>
            <p className='mb-6 text-lg italic font-semibold text-dark dark:text-light'>Información General </p>

            {/* Fila 1: Nombre de Producto y Código */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <FormItem
                        // Etiqueta con asterisco indicando que es obligatorio
                        label="Nombre de Producto *"
                        invalid={errors.name && touched.name}
                        errorMessage={errors.name}
                    >
                        <Field
                            type="text"
                            name="name"
                            autoComplete="off"
                            placeholder="Ej. Televisor 40 pulgadas"
                            component={Input}
                        />
                    </FormItem>
                </div>
                <div>
                    <FormItem
                        label="Código *"
                        invalid={errors.sku && touched.sku}
                        errorMessage={errors.sku}
                    >
                        <Field
                            type="text"
                            name="sku"
                            autoComplete="off"
                            placeholder="Ej. SKU-1234"
                            component={Input}
                        />
                    </FormItem>
                </div>
            </div>

            {/* Fila 2: Stock, Stock Mínimo y Unidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <FormItem
                        label="Stock *"
                        invalid={errors.stock && touched.stock}
                        errorMessage={errors.stock}
                    >
                        <Field name="stock">
                            {({ field, form }) => (
                                <NumberFormatInput
                                    form={form}
                                    field={field}
                                    placeholder="Ej. 100"
                                    customInput={NumberInput}
                                    onValueChange={(e) => {
                                        form.setFieldValue(field.name, e.value)
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div>
                    <FormItem
                        label="Stock Mínimo *"
                        invalid={errors.stockMin && touched.stockMin}
                        errorMessage={errors.stockMin}
                    >
                        <Field name="stockMin">
                            {({ field, form }) => (
                                <NumberFormatInput
                                    form={form}
                                    field={field}
                                    placeholder="Ej. 10"
                                    customInput={NumberInput}
                                    onValueChange={(e) => {
                                        form.setFieldValue(field.name, e.value)
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
                <div>
                    <FormItem
                        label="Unidad *"
                        invalid={errors.unitId && touched.unitId}
                        errorMessage={errors.unitId}
                    >
                        <Field name="unitId">
                            {({ field, form }) => (
                                <Select
                                    field={field}
                                    form={form}
                                    placeholder="Seleccione una unidad (p. ej. Cajas)"
                                    options={unitOptions}
                                    value={unitOptions.filter(
                                        (option) => option.value === values.unitId
                                    )}
                                    onChange={(option) =>
                                        form.setFieldValue(field.name, option.value)
                                    }
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
