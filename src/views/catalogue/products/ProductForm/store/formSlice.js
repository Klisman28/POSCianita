import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSubcategories } from 'services/catalogue/SubcategoryService'
import { apiGetBrands } from 'services/catalogue/BrandService'
import { apiGetProductUnits } from 'services/catalogue/ProductService'

export const getSubategories = createAsyncThunk(
    'catalogue/products/getSubategories',
    async () => {
        const response = await apiGetSubcategories()
        return response.data
    }
)

export const getBrands = createAsyncThunk(
    'catalogue/products/getBrands',
    async () => {
        const response = await apiGetBrands()
        return response.data
    }
)

export const getProductUnits = createAsyncThunk(
    'catalogue/products/getProductUnits',
    async () => {
        const response = await apiGetProductUnits()
        return response.data
    }
)

const newSlice = createSlice({
    name: 'catalogue/products/data',
    initialState: {
        subcategoryList: [],
        brandList: [],
        unitList: [],
    },
    reducers: {},
    extraReducers: {
        [getSubategories.fulfilled]: (state, action) => {
            state.subcategoryList = action.payload.data.subcategories
        },
        [getBrands.fulfilled]: (state, action) => {
            state.brandList = action.payload.data.brands
        },
        [getProductUnits.fulfilled]: (state, action) => {
            state.unitList = action.payload.data
        },
    }
})

export default newSlice.reducer
