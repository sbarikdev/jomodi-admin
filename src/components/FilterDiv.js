import React, { useState } from 'react';
import { Button, Select, TextInput } from '@mantine/core';

const FilterDiv = () => {
    // State for filter criteria
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState('');

    // Function to apply the filter
    const handleFilter = () => {
        // Perform the filtering logic based on the state values (name, category, color, and price)
        // For example, you can send the filter values to the server or update the UI based on the filters.
        // The actual filtering implementation depends on your specific use case.
        console.log('Filter criteria:', { name, category, color, price });
    };

    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {/* Name filter */}
            <TextInput
                label="Name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="Enter name..."
            />

            {/* Category filter */}
            <Select
                label="Category"
                placeholder="Select category"
                value={category}
                onChange={(value) => setCategory(value)}
                data={[
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    // Add more category options as needed
                ]}
            />

            {/* Color filter */}
            <TextInput
                label="Color"
                value={color}
                onChange={(event) => setColor(event.currentTarget.value)}
                placeholder="Enter color..."
            />

            <TextInput
                label="Price"
                value={price}
                onChange={(event) => setPrice(event.currentTarget.value)}
                placeholder="Enter price..."
            />
            <Button onClick={handleFilter}>Apply Filter</Button>
        </div>
    );
};

export default FilterDiv;
