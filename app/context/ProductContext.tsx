import { createContext, PropsWithChildren, useContext, useState } from "react";
import productApi from "@/api/productApi";

const ProductContext = createContext<{
    addProduct: (data: object) => void;
    updateProduct: (data: object, id: string) => void;
    deleteProduct: (id: string) => void;
    isSubmitting: boolean;
}>({
    addProduct: (data: object) => null,
    updateProduct: (data: object, id: string) => null,
    deleteProduct: (id: string) => null,
    isSubmitting: false,
});

export function ProductProvider({ children }: PropsWithChildren) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addProduct = async (data: object) => {
        setIsSubmitting(true);
        try {
            console.log("hello");
            const response = await productApi().createProduct(data);
            if (response.error) {
                throw new Error(response.error);
            }
            console.log("Product added:", response);
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateProduct = async (data: object, id: string) => {  
        setIsSubmitting(true);
        try {
            const response = await productApi().updateProductById(data, id);  
            if (response.error) {
                throw new Error(response.error);
            }
            console.log("Product updated:", response);
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteProduct = async (id: string) => {
        setIsSubmitting(true);
        try {
            const response = await productApi().deleteProductById({ id });
            if (response.error) {
                throw new Error(response.error);
            }
            console.log("Product deleted:", response);
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProductContext.Provider value={{ addProduct, updateProduct, deleteProduct, isSubmitting }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
};
