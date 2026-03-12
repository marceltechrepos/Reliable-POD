export const moveLayer = (layers, selectedIndex, direction, step = 1) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const updated = [...layers];
    const layer = { ...updated[selectedIndex] };

    switch (direction) {
        case 'up':
            layer.positionY = Math.max(-50, (layer.positionY || 0) - step);
            break;
        case 'down':
            layer.positionY = Math.min(150, (layer.positionY || 0) + step);
            break;
        case 'left':
            layer.positionX = Math.max(-50, (layer.positionX || 0) - step);
            break;
        case 'right':
            layer.positionX = Math.min(150, (layer.positionX || 0) + step);
            break;
        default:
            return layers;
    }

    updated[selectedIndex] = layer;
    return updated;
};

export const setLayerPosition = (layers, selectedIndex, x, y) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const updated = [...layers];
    updated[selectedIndex] = {
        ...updated[selectedIndex],
        positionX: x,
        positionY: y
    };
    return updated;
};

export const resizeLayer = (layers, selectedIndex, width, height) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const updated = [...layers];
    updated[selectedIndex] = {
        ...updated[selectedIndex],
        width: Math.max(5, Math.min(100, width)),
        height: Math.max(5, Math.min(100, height))
    };
    return updated;
};

export const rotateLayer = (layers, selectedIndex, degrees) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const updated = [...layers];
    updated[selectedIndex] = {
        ...updated[selectedIndex],
        rotation: ((updated[selectedIndex].rotation || 0) + degrees) % 360
    };
    return updated;
};

export const duplicateLayer = (layers, selectedIndex) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const layer = layers[selectedIndex];
    const duplicated = {
        ...layer,
        _id: undefined,
        positionX: (layer.positionX || 0) + 5,
        positionY: (layer.positionY || 0) + 5,
        zIndex: layers.length + 1,
        locked: false
    };

    return [...layers, duplicated];
};

export const toggleLayerLock = (layers, selectedIndex) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    const updated = [...layers];
    updated[selectedIndex] = {
        ...updated[selectedIndex],
        locked: !updated[selectedIndex].locked
    };
    return updated;
};

export const deleteLayer = (layers, selectedIndex) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }

    return layers.filter((_, i) => i !== selectedIndex);
};

export const alignLayerHorizontal = (layers, selectedIndex, align, printArea) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }
    if (!printArea) return layers;

    const updated = [...layers];
    const layer = { ...updated[selectedIndex] };

    if (align === 'left') {
        layer.positionX = 0;
    } else if (align === 'center') {
        layer.positionX = 50 - (layer.width / 2);
    } else if (align === 'right') {
        layer.positionX = 100 - layer.width;
    }

    
    layer.horizontalAlign = align;

    updated[selectedIndex] = layer;
    return updated;
};

export const alignLayerVertical = (layers, selectedIndex, align, printArea) => {
    if (selectedIndex === null || selectedIndex < 0 || selectedIndex >= layers.length) {
        return layers;
    }
    if (!printArea) return layers;

    const updated = [...layers];
    const layer = { ...updated[selectedIndex] };

    if (align === 'top') {
        layer.positionY = 0;
    } else if (align === 'middle') {
        layer.positionY = 50 - (layer.height / 2);
    } else if (align === 'bottom') {
        layer.positionY = 100 - layer.height;
    }

    layer.verticalAlign = align;

    updated[selectedIndex] = layer;
    return updated;
};