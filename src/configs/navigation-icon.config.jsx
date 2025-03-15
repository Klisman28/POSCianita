import React from 'react'
import {
    HiOutlineColorSwatch, 
	HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineLockOpen,
    HiOutlineShoppingCart,
    HiOutlineDocumentAdd,
    HiOutlineCollection,
    HiOutlineCube,
    HiOutlineTag,
    HiOutlineTicket,
    HiOutlineUserGroup,
    HiOutlineOfficeBuilding,
    HiOutlineUsers,
    HiOutlineUserCircle,
    HiOutlineLibrary,
    HiOutlineCog
} from 'react-icons/hi'
// import {} from 'react-icons/hi'

const navigationIcon = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    //warehouseMenu
    purchasesIcon: <HiOutlineShoppingBag />,
    cashiersIcon: <HiOutlineDesktopComputer/>,
    // transactionMenu
    openingsIcon: <HiOutlineLockOpen/>,
    salesOpeningIcon: <HiOutlineShoppingCart/>,
    salesOpeningNewIcon: <HiOutlineDocumentAdd/>,
    salesReportIcon: <HiOutlineCollection />,
    configsIcon: <HiOutlineCog />,

    productsIcon: <HiOutlineCube />,
    brandsIcon: <HiOutlineTicket />,
    categoriesIcon: <HiOutlineTag />,
    subcategoriesIcon: <HiOutlineTag />,

    customersIcon: <HiOutlineUserGroup />,
    enterprisesIcon: <HiOutlineOfficeBuilding />,

    employeesIcon: <HiOutlineUsers />,
    suppliersIcon: <HiOutlineLibrary />,
    usersIcon: <HiOutlineUserCircle />,
}

export default navigationIcon