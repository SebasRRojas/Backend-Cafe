/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ProductsStackParams } from '../navigation/ProductsNavigator';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { }

export const ProductScreen = ({ navigation, route }: Props) => {

    const { id = '', name = '' } = route.params;

    const [tempURI, setTempURI] = useState<string>();

    const { categories } = useCategories();

    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
    });

    const { loadProductById, addProduct, updateProduct, deleteProduct, uploadImage } = useContext(ProductsContext);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: (nombre) ? nombre : 'Sin nombre',
        });
    }, [nombre]);

    useEffect(() => {
        loadProduct();
    }, []);

    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        marginRight: 10,
                    }}
                    onPress={() => deleteProduct(_id)}
                >
                    <Text>Borrar</Text>
                </TouchableOpacity>
            ),
        });

    }, []);

    const loadProduct = async () => {
        if (_id.length === 0) return;

        const product = await loadProductById(id);
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre: product.nombre,
        });
    };

    const saveOrUpdate = async () => {
        if (_id.length > 0) {
            updateProduct(categoriaId, nombre, id);
        } else {
            const tempCategoriaId = categoriaId || categories[0]._id;
            const newProduct = await addProduct(tempCategoriaId, nombre);
            onChange(newProduct._id, '_id');
        }
    };

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets) return;
            if (!resp.assets[0].uri) return;

            setTempURI(resp.assets[0].uri);
            uploadImage(resp, _id);
        });
    };

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel) return;
            if (!resp.assets) return;
            if (!resp.assets[0].uri) return;

            setTempURI(resp.assets[0].uri);
            uploadImage(resp, _id);
        });
    };

    return (
        <View style={styles.container}>

            <ScrollView>
                <Text style={styles.label}>Nombre del producto:</Text>
                <TextInput
                    placeholder="Producto"
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                <Text style={styles.label}>Categoria:</Text>

                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => {
                        onChange(value, 'categoriaId');
                    }}
                >

                    {
                        categories.map(c => (
                            <Picker.Item
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>


                <Button
                    title="Guardar"
                    onPress={saveOrUpdate}
                    color="#5856D6"
                />

                {
                    (_id.length > 0) && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, }}>
                            <Button
                                title="Cámara"
                                onPress={takePhoto}
                                color="#5856D6"
                            />
                            <View style={{ width: 10 }} />
                            <Button
                                title="Galería"
                                onPress={takePhotoFromGallery}
                                color="#5856D6"
                            />
                        </View>
                    )
                }

                {
                    (img.length && !tempURI) > 0 && (
                        <Image
                            source={{ uri: img }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                            }}
                        />
                    )
                }

                {
                    (tempURI) && (
                        <Image
                            source={{ uri: tempURI }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                            }}
                        />
                    )
                }



            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
    },
    label: {
        fontSize: 18,
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 10,
    },
});
