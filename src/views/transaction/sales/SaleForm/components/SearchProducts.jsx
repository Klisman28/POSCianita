import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { Dialog, Button, Badge, Tag } from 'components/ui'
import { searchProducts } from '../store/formSlice'
import useThemeClass from 'utils/hooks/useThemeClass'
import debounce from 'lodash/debounce'
import { HiOutlineSearch, HiShoppingCart } from 'react-icons/hi'
import Highlighter from 'react-highlight-words'
import { useDispatch, useSelector } from 'react-redux'
import { FiPackage, FiAlertTriangle } from 'react-icons/fi'
import { toast, Notification } from 'components/ui'

export const SearchProducts = ({ handleAppendProduct, children }) => {

    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const productList = useSelector((state) => state.saleForm.data.productList)

    const dispatch = useDispatch()
    const inputRef = useRef()
    const { textTheme } = useThemeClass()

    const handleSearchOpen = () => setSearchDialogOpen(true)
    const handleSearchClose = () => setSearchDialogOpen(false)

    const debounceFn = debounce(handleDebounceFn, 200)
    async function handleDebounceFn(query) {
        if (!query) return
        await dispatch(searchProducts({ search: query }))
    }

    const handleSearch = (e) => {
        debounceFn(e.target.value)
    }

    useEffect(() => {
        if (searchDialogOpen) {
            const timeout = setTimeout(() => inputRef.current?.focus(), 100)
            return () => clearTimeout(timeout)
        }
    }, [searchDialogOpen])

    const handleClick = (product) => {
        if (product.stock > 0) {
            handleAppendProduct(product)
            setSearchDialogOpen(false)
        } else {
            toast.push(
                <Notification title="¡Stock Agotado!" type="danger" duration={3000}>
                    No se puede agregar, el STOCK está agotado
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <>
            {/* 
               children -> será un nodo que, al hacer clic, dispara el diálogo. 
               Por defecto, si no pasas nada en children, puedes mantener 
               tu original <div> "Agregar Producto..." 
            */}
            <div onClick={handleSearchOpen}>
                {children || (
                    <div
                        className="text-2xl bg-slate-200 py-2 px-4 rounded-full flex items-center"
                    >
                        <HiOutlineSearch />
                        <span className='text-sm pl-4'>Agregar Producto...</span>
                    </div>
                )}
            </div>

            {/* Diálogo para la búsqueda */}
            <Dialog
                contentClassName="p-0"
                isOpen={searchDialogOpen}
                closable={false}
                onRequestClose={handleSearchClose}
                width={800}
            >
                <div>
                    <div className="px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center">
                            <HiOutlineSearch className="text-xl" />
                            <input
                                ref={inputRef}
                                className="ring-0 outline-none block w-full p-4
                                           text-base bg-transparent text-gray-900
                                           dark:text-gray-100"
                                placeholder="Buscar productos..."
                                onChange={handleSearch}
                            />
                        </div>
                        <Button size="xs" onClick={handleSearchClose}>
                            Cerrar
                        </Button>
                    </div>

                    <div className="py-4 px-5 max-h-[550px] overflow-y-auto">
                        <h6 className="mb-2">Productos</h6>
                        {productList.map(product => (
                            <div className="mb-1" key={product.id}>
                                <div
                                    className={
                                        classNames(
                                            'flex items-center justify-between rounded-lg p-2 cursor-pointer',
                                            'bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700/90'
                                        )
                                    }
                                    onClick={() => handleClick(product)}
                                >
                                    <div className="flex items-center">
                                        <div
                                            className={
                                                classNames(
                                                    'mr-2 rounded-md ring-1 ring-slate-900/5 shadow-sm text-xl h-6 w-6 flex items-center justify-center bg-white dark:bg-gray-700',
                                                    textTheme,
                                                    'dark:text-gray-100'
                                                )
                                            }
                                        >
                                            <FiPackage />
                                        </div>
                                        <div className="text-gray-900 dark:text-gray-300 flex items-center space-x-4">
                                            <Highlighter
                                                autoEscape
                                                highlightClassName={classNames(
                                                    textTheme,
                                                    'underline bg-transparent font-semibold dark:text-white'
                                                )}
                                                searchWords={[inputRef.current?.value || '']}
                                                textToHighlight={product.name}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-blue-600" />
                                                <span className="capitalize font-semibold">
                                                    {product.brand.name}
                                                </span>
                                            </div>
                                            <div>
                                                Precio: Q {product.price}
                                            </div>
                                            <div>
                                                {product.stock > 0 ? (
                                                    <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                                                        <span className="capitalize">
                                                            Stock: {product.stock} {product.unit.symbol}
                                                        </span>
                                                    </Tag>
                                                ) : (
                                                    <Tag className="bg-red-200 text-red-600 dark:bg-red-500/20 dark:text-red-100 rounded-md border-0 mx-2">
                                                        <span className="capitalize">
                                                            Agotado
                                                        </span>
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <HiShoppingCart className={classNames(textTheme, 'text-lg')} />
                                </div>
                            </div>
                        ))}

                        {productList.length === 0 && (
                            <div className="my-10 text-center text-amber-500 text-sm flex items-center justify-center space-x-2">
                                <FiAlertTriangle className='h-4 w-4' />
                                <span>No hay productos que coincidan con el término</span>
                                <span className="heading-text">
                                    '{inputRef.current?.value}'
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SearchProducts
