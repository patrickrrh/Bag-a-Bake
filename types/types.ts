export type UserType = {
    email: string;
    password: string;
    regionId: number;
    roleId: number;
    signUpDate: string;
    userId: number;
    userImage: string | null;
    userName: string;
    userPhoneNumber: string;
    regionUser: RegionType;
    bakery: BakeryType;
};

export type BakeryType = {
    bakeryId: number;
    userId: number;
    regionId: number;
    bakeryName: string;
    bakeryImage: string;
    bakeryDescription: string;
    bakeryPhoneNumber: string;
    openingTime: string;
    closingTime: string;
    favorite: FavoriteType[];
}

export type FavoriteType = {
    favoriteId: number;
    userId: number;
    bakeryId: number;
}

export type CategoryType = {
    categoryId: number;
    categoryName: string;
    categoryImage: string;
}

export type OrderType = {
    totalOrderPrice: any;
    isRated: boolean;
    bakery: any;
    orderId: number;
    orderStatus: number;
    userId: number;
    bakeryId: number;
    orderDate: string;
    user: UserType;
    orderDetail: OrderDetailType[];
};

export type OrderDetailType = {
    orderDetailId: number;
    orderId: number;
    productId: number;
    productQuantity: number;
    product: ProductType;
    totalDetailPrice: number;
};

export type ProductType = {
    productId: number;
    bakeryId: number;
    categoryId: number;
    productName: string;
    productPrice: string;
    productImage: string;
    productDescription: string;
    productExpirationDate: string;
    productStock: number;
    isActive: number;
};

export type RegionType = {
    regionId: number;
    regionName: string;
}