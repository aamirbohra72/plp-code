"use client"
import { useEffect, useState } from "react";

const Plp = () => {
    const [filterData, setFilterData] = useState([]);
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState([]);
    const [sortingOption, setSortingOption] = useState('');
    const [selectedValues, setSelectedValues] = useState<any>({});

    const catId = '9296';

    const getCategoryData = async (catId: any, filters: any, sort: any) => {
        const resp = await fetch(`https://ecomm-dev-catalogue.up.railway.app/products-by-category/${catId}?${filters ? `queryFacet=${filters}` : ''}${sort ? `${filters ? '&' : ''}sort=${sort}` : ''}`, {
            method: "GET",
        });
        const result = await resp.json();
        setProducts(result.productData);
        setFilterData(result.valueFacets);
        setSortOption(result.sortingOption);
    };

    useEffect(() => {
        setProducts([]);
        const queryString = Object.entries(selectedValues)
            .map(([key, values]: any) => `${key}=${values?.map(encodeURIComponent).join(",")}`)
            .join("/");
        getCategoryData(catId, queryString, sortingOption);
    }, [catId, selectedValues, sortingOption]);

    const handleCheckboxChange = (parameterName: any, value: any) => {
        setSelectedValues((prevState: any) => {
            const currentValues = prevState[parameterName] || [];

            if (currentValues.includes(value)) {
                const updatedValues = currentValues.filter((selectedValue: any) => selectedValue !== value);

                if (updatedValues.length === 0) {
                    const { [parameterName]: _, ...rest } = prevState;
                    return rest;
                } else {
                    return {
                        ...prevState,
                        [parameterName]: updatedValues,
                    };
                }
            } else {
                return {
                    ...prevState,
                    [parameterName]: [...currentValues, value],
                };
            }
        });
    };


    const handleRadioChange = (parameterName: any, value: any) => {
        setSelectedValues((prevState: any) => ({
            ...prevState,
            [parameterName]: [value],
        }));
    };
    return (
        <div className="py-5">
            <div className="flex px-5 w-full justify-end">
                <label>Sort by:
                    <select onChange={(e) => setSortingOption(e.target.value)} className="w-60 ml-3 border border-gray-600 px-3 py-2 rounded">
                        <option disabled selected value="">select sorting rule</option>
                        {sortOption.length > 0 ?
                            sortOption.map((item: any) => {
                                return (
                                    <option value={item.value}>{item.name}</option>
                                )
                            }) : ''}
                    </select>
                </label>
            </div>
            <div className="flex">
                <div className="w-[25%]">
                    <p className="font-bold text-gray-500 px-3">Filters</p>
                    <div className="p-1">
                        {filterData.length > 0 ?
                            filterData.map((data: any) => {
                                return (
                                    <div className="p-1">
                                        <div className="py-1 px-2 border border-gray-400">
                                            <p className="font-medium">{data.displayName}</p>
                                            {data.isMultiValued ?
                                                data.value.map((val: any) => {
                                                    return (

                                                        <div style={{ display: "flex", padding: "3px" }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedValues[data.name]?.includes(val.value)}
                                                                onChange={() => handleCheckboxChange(data.name, val.value)}
                                                            />
                                                            <label className="pl-2">{val?.name}</label>
                                                        </div>


                                                    )
                                                }) :
                                                data.value.map((val: any) => {
                                                    return (
                                                        <div style={{ display: "flex", padding: "3px" }}>
                                                            <input
                                                                type="radio"
                                                                checked={selectedValues[data.name] === val.value}
                                                                onChange={() => handleRadioChange(data.name, val.value)}
                                                            />
                                                            <label className="pl-2">{val?.name}</label>
                                                        </div>)
                                                })}
                                        </div>
                                    </div>
                                )
                            }) : ''}
                    </div>
                </div>
                <div>
                    <h2>Products</h2>
                    <div className="grid grid-cols-12">
                        {products.length > 0 ?
                            products?.map((product: any) => (
                                <div className="col-span-3 p-4" key={product.productId}>
                                    <img className="h-60 object-cover w-full" src={product.productImage} alt={product.productName} width="100" />
                                    <h3>{product.productName}</h3>
                                    <p>Price: ${product.productPrice.sellingPrice}</p>
                                </div>
                            )) : ''}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Plp;
