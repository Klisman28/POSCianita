import React, { forwardRef } from 'react'
import { FormContainer, Button } from 'components/ui'
import { StickyFooter } from 'components/shared'
import BasicInfoFields from './BasicInfoFields'
import OrderProducts from './OrderProducts'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { injectReducer } from 'store/index'
import reducer from './store'
import SearchProduct from './components/SearchProducts'
import PaymentSummary from './components/PaymentSummary'
import OptionsFields from './OptionsFields'
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from 'dayjs'
import { toast, Notification } from 'components/ui'

injectReducer('saleForm', reducer)

const productsSchema = Yup.object({
    name: Yup.string(),
    brand: Yup.string(),
    unit: Yup.string(),
    productId: Yup.number().required(),
    quantity: Yup.number().positive('Cantidad debe ser mayor a 0').required("Es requerido"),
    price: Yup.number().required(),
    subtotal: Yup.number().required(),
    stock: Yup.number(),
});

const validationSchema = Yup.object().shape({
    serie: Yup.string()
        .when('type', {
            is: (val) => val !== 'Ticket',
            then: Yup.string()
                .required("Serie es requerida")
                .matches(/[0-9]/, { message: "La serie solo admite números" })
                .min(3, "Serie demasiado corto")
                .max(3, "Serie demasiado largo")
        }),
    number: Yup.string()
        .required("Número es requerido")
        .matches(/[0-9]/, { message: "Número solo admite números" })
        .min(6, "Número demasiado corto")
        .max(6, "Número demasiado largo"),
    type: Yup.string().required("Tipo de comprobante es requerido"),
    client: Yup.object()
        .when('type', {
            is: (val) => val !== "Ticket",
            then: Yup.object({
                value: Yup.string().required("Seleccione un cliente"),
                label: Yup.string().required("Seleccione un cliente")
            })
        }),
    products: Yup.array().of(productsSchema).min(1, "Seleccione al menos un producto"),
    applyIgv: Yup.boolean(),
    dateIssue: Yup.date().required("La fecha es requerida")
});

const SaleForm = forwardRef((props, ref) => {

    const { typeAction, initialData, onFormSubmit, onDiscard, } = props

    const {
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        getValues,
        watch,
        resetField,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        defaultValues: initialData
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    })

    const handleChangeQuantity = (index, increse = true) => {
        const stock = getValues(`products.${index}.stock`)
        const qty = parseInt(getValues(`products.${index}.quantity`));
        const indexText = `products.${index}.quantity`;

        if (increse) {
            if (stock >= qty + 1) {
                setValue(indexText, (qty + 1));
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
        } else {
            if (qty > 1) {
                setValue(indexText, (qty - 1));
            }
        }

        const newQty = parseInt(getValues(`products.${index}.quantity`))
        const price = parseFloat(getValues(`products.${index}.price`))

        const subtotal = newQty * price

        setValue(`products.${index}.subtotal`, subtotal);
    }

    const handleAppendProduct = (product) => {
        const index = fields.findIndex(item => item.productId === product.id);

        if (index === -1) {
            append({
                name: product.name,
                brand: product.brand.name,
                unit: product.unit.symbol,
                productId: product.id,
                quantity: 1,
                price: parseFloat(product.price),
                subtotal: parseFloat(product.price),
                stock: parseInt(product.stock)
            })
        } else {
            handleChangeQuantity(index, true);
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} ref={ref}>
            <FormContainer>
                <div className="xl:flex gap-4">
                    <div className="w-full">
                        <div>
                            <SearchProduct handleAppendProduct={handleAppendProduct} />
                        </div>
                        <OrderProducts
                            errors={errors}
                            fields={fields}
                            remove={remove}
                            control={control}
                            watch={watch}
                            setValue={setValue}
                            getValues={getValues}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                        <div className="xl:grid grid-cols-2 gap-4">
                            <OptionsFields control={control} />
                            <PaymentSummary watch={watch} />
                        </div>
                        {/* <Activity data={data.activity} /> */}
                    </div>
                    <div className="xl:max-w-[260px] w-full">
                        <BasicInfoFields
                            control={control}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                            resetField={resetField}
                        />
                    </div>
                </div>
                <StickyFooter
                    className="-mx-8 px-8 flex items-center justify-end py-4"
                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                    <div className="md:flex items-center">
                        <Button
                            size="sm"
                            className="ltr:mr-3 rtl:ml-3"
                            onClick={() => onDiscard?.()}
                            type="button"
                        >
                            Descartar
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            loading={false}
                            icon={<AiOutlineSave />}
                            type="submit"
                        >
                            {(typeAction === 'create') ? ' Guardar' : 'Actualizar'}
                        </Button>
                    </div>
                </StickyFooter>
            </FormContainer>
        </form>
    )
})

SaleForm.defaultProps = {
    initialData: {
        serie: '001',
        number: '000001',
        type: 'Ticket',
        client: {},
        dateIssue: dayjs(new Date(), 'DD/MM/YYYY').toDate(),
        products: [],
        applyIgv: false,
    },
    typeAction: 'create'
}

export default SaleForm