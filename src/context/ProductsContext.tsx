/* eslint-disable curly */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';
import cafeApi from '../api/cafeApi';
import { ImagePickerResponse } from 'react-native-image-picker';

type ProductsContextsProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; //TODO: Cambiar Any
}


export const ProductsContext = createContext({} as ProductsContextsProps);



export const ProductsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);
    };

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId,
        });

        setProducts([...products, resp.data]);

        return resp.data;
    };

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId,
        });

        setProducts(products.map((prod) => {
            return (prod._id === productId)
                ? resp.data
                : prod
                ;
        }));
    };

    const deleteProduct = async (id: string) => {
        const resp = await cafeApi.delete<Producto>(`/productos/${id}`);
    };

    const loadProductById = async (id: string) => {
        const resp = await cafeApi.get<Producto>(`/productos/${id}`);
        return resp.data;
    };

    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        if (!data.assets) return;

        const params = {
            uri: data.assets[0].uri,
            type: data.assets[0].type,
            name: data.assets[0].fileName,
        };

        const fileToUpload = JSON.parse(JSON.stringify(params));

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

        } catch (error) {
            console.log(error);
        }

    };


    return (
        <ProductsContext.Provider
            value={{
                products,
                loadProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                loadProductById,
                uploadImage,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

